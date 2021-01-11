/**
 * Created with JetBrains WebStorm.
 * User: dawson.liu
 * Date: 13-9-5
 * Time: 下午1:17
 * To change this template use File | Settings | File Templates.
 **************** 命名规范&使用规范 *******************
 * _ALL**：所有未做处理的数据；除非必要，不能在其他页面使用此属性
 * ALL**：历史属性，存在全部或过滤的逻辑；新页面不能使用此属性
 * User**：当前用户拥有权限的列表；所有不需要限制当前上下文的页面请均使用此列表
 * UserContext**：当前用户拥有的当前上下文的列表；所有需要使用上下文的页面请均使用此列表
 * find**：find方法中直接使用_ALL**属性，避免某些情况无法显示的问题
 * 所有业务数据列表属性需要具备基本属性：{id:**,name:**}
 * 所有枚举列表属性需要具备基本属性：{text:**,value:**}
 */

/**
*   CommonModels 各种字段的含义，使用场景参考上方命名&使用规范的解释^_^
*   User**
*       UserCorporations => 用户可查看的法人
*       UserAccountingEntities => 用户核算主体
*       UserCommodities => 用户可查看的品种
*       UserCommodityTypes => 用户可查看的品类
*       UserCustomersIncludeCorporations => 用户可查看的客户(包含法人)
*       UserCustomersExcludeCorporations => 用户可查看的客户(不包含法人)
*/

var GMK = GMK || {};
GMK.Features = GMK.Features || {};

function normalize(data, properties, keep) {
    $.each(properties, function (i, item) {
        if (data[item] != undefined) data[item.toTitleCase()] = data[item];
        if (keep !== true) delete data[item];
    });
}

function normalizeMessage(data) {
    normalize(data, ['Status', 'Message', 'ReturnStatus'], true);
}
function normalizePagination(pagination) {
    normalize(pagination, ['CurrentPage', 'PageCount', 'PageSize', 'TotalCount']);
}
function normalizeData(data) {
    normalize(data, ['Data'], true);
}
var ajaxCount = 0;
GMK.Features.FeatureBase = {
    _showSpinner: function (callback) {
        var spinner = document.getElementById('page-spinner');
        if (spinner) {
            spinner.style.display = 'block';
        }
        if (callback) {
            setTimeout(callback, 0);
        }
    },
    _hideSpinner: function (callback) {
        var spinner = document.getElementById('page-spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
        if (callback) {
            setTimeout(callback, 0);
        }
    },
    _preProcessUrl: function (path) {
        if (/^\//g.test(path)) return path;

        //if (path[0] == '/') path = path.substr(1);

        return window.GMK.Context.RootUrl + path;
    },
    _get: function (url, query, callback, autoFormat, noSpinner) {
        query = ko.toJS(query);
        if (_.isFunction(query)) {
            console.warn(utils.t("featureBase.leakOfParams"));
            return this._get(url, {}, query, callback, autoFormat);
        }
        if (!noSpinner) {
            showSpinner && showSpinner();
            ajaxCount++;
        }
        utils.flickAlert('');
        query = utils.getCleanedEmpty(query);
        if (autoFormat == undefined) autoFormat = true;

        return $.getJSON(this._preProcessUrl(url), query, function (result) {
            normalizeMessage(result);
            //  $('#page-spinner').hide();
            if (result.status !== undefined && !result.status) {
                alertify.alert(utils.t("featureBase.requestFailedMsg").format(result.message)).show();
            } else {
                normalizeData(result);
                if (callback) callback(result);
                if (autoFormat) utils.autoFormatString();
            }
        }).fail(function () {
            if (!noSpinner) {
                ajaxCount--;
                hideSpinner();
            }
        }).done(function (result) {
            if (!noSpinner) {
                ajaxCount
                hideSpinner();
                utils.flickAlert((result.returnStatus == 2) ? result.message : (result.message || utils.t("featureBase.loadingSuccess")));
            }
        });
    },
    _post: function (url, query, callback, autoFormat, dataType, onfail, onFailPre, contentType) {
        query = ko.toJS(query);
        if (_.isFunction(query)) {
            console.warn(utils.t("featureBase.leakOfParams"));
            return this._post(url, {}, query, callback, autoFormat, dataType);
        }
        showSpinner && showSpinner();
        utils.flickAlert('');
        if (autoFormat !== false) autoFormat = true;
        query = utils.getCleanedEmpty(query);
        return $.ajax({
            type: 'POST',
            url: this._preProcessUrl(url),
            data: ko.toJSON(query),
            dataType: dataType || 'json',
            contentType: contentType || "application/json",
            success: function (result) {
                normalizeMessage(result);
                hideSpinner();
                if (result.status !== undefined && !result.status) {
                    if (utils && utils.alert) {
                        if (onFailPre) {
                            onFailPre(result);
                        }
                        utils.alert(utils.t("featureBase.operateFailedMsg").format(result.message), function () {
                            if (onfail) {
                                onfail(result);
                            }
                        });
                    } else {
                        if (onFailPre) {
                            onFailPre(result);
                        }
                        alert(utils.t("featureBase.operateFailedMsg").format(result.message));
                        if (onfail) {
                            onfail(result);
                        }
                    }
                } else {
                    utils.flickAlert((result.returnStatus == 2) ? result.message : (result.message || utils.t("featureBase.operateSuccess")));
                    normalizeData(result);
                    if (callback) callback(result);
                    if (autoFormat) utils.autoFormatString();
                }
            },
            error: function () {
                hideSpinner();
                alert(utils.t("featureBase.serverErrorPlsContactAdmin"));
                //},
                //complete: function () {
                //    $('#page-spinner').hide();
            }
        });
    },
    _postThenBack: function (url, query, callback, autoFormat, dataType) {
        var _back = this._back;
        this._post(this._preProcessUrl(url), query, function (result) {
            Cookies.set('alert-message', (result.returnStatus == 2) ? result.message : (result.message || '操作成功'));
            if (callback) callback(result);
            _back();
        }, autoFormat, dataType);
    },
    _save: function (url, data, onsuccess, onfail) {
        data = ko.toJS(data);
        if (_.isFunction(data)) {
            console.warn(utils.t("featureBase.leakOfParams"));
            return this._save(url, {}, data, onsuccess);
        }
        showSpinner && showSpinner();
        utils.flickAlert('');
        data = utils.getCleanedEmpty(data);
        return $.ajax({
            type: 'POST',
            url: this._preProcessUrl(url),
            data: ko.toJSON(data),
            contentType: "application/json",
            success: function (result) {
                normalizeMessage(result);
                hideSpinner();
                if (!result.status) {
                    alert(utils.t("featureBase.saveFailed").format(result.message));
                    if (onfail) onfail(result);
                } else {
                    utils.flickAlert((result.returnStatus == 2) ? result.message : (result.message || utils.t("featureBase.saveSuccess")));
                    if (onsuccess) onsuccess(result);
                }
            },
            error: function () {
                hideSpinner();
                alert(utils.t("featureBase.serverErrorPlsContactAdmin"));
                //},
                //complete: function () {
                //    $('#page-spinner').hide();
            }
        });
    },
    _saveThenBack: function (url, data, onsuccess, onfail, backUrl) {
        var _back = this._back;
        this._save(this._preProcessUrl(url), data, function (result) {
            Cookies.set('alert-message', (result.returnStatus == 2) ? result.message : (result.message || '保存成功'));
            if (onsuccess) onsuccess(result);
            _back(backUrl);
        }, onfail);
    },
    _back: function (url) {
        if (history.length === 1) {
            if (!!url) {
                window.location.href = url;
            } else {
                history.back();
                setTimeout(function () {
                    window.close();
                }, 500);
            }
        } else {
            history.back();
        }
    },
    _delete: function (url, data, onsuccess, onfail, autoFormat) {
        if (autoFormat == undefined) autoFormat = true;
        var self = this;
        confirm(utils.t("featureBase.confirmDelete"), function () {
            showSpinner()
            utils.flickAlert('');
            return $.ajax({
                type: 'POST',
                url: self._preProcessUrl(url),
                data: ko.toJSON(data),
                dataType: 'json',
                contentType: "application/json",
                success: function (result) {
                    normalizeMessage(result);
                    hideSpinner();
                    if (!result.status) {
                        alert(utils.t("featureBase.operateFailedMsg").format(result.message));
                        if (onfail) onfail(result);
                    } else {
                        utils.flickAlert((result.returnStatus == 2) ? result.message : (result.message || utils.t("featureBase.deleteSuccess")));
                        if (onsuccess) onsuccess(result);
                        if (autoFormat) utils.autoFormatString();
                    }
                },
                error: function () {
                    hideSpinner();
                    alert(utils.t("featureBase.serverErrorPlsContactAdmin"));
                    //},
                    //complete: function () {
                    //    $('#page-spinner').hide();
                }
            });
        });
    },
    _paginateOptions: {
        display: 15,
        border: false,
        text_color: '#08c',
        background_color: '#fefefe',
        border_hover_color: '#ccc',
        text_hover_color: '#727272',
        background_hover_color: '#dbdbdb',
        images: false,
    },
    _paginate: function ($elem, pagination, queryCallback, searchUrl, fillCallback, paramCallback, noNeedFixCurrenctUrl) {
        normalizePagination(pagination);
        if (pagination.currentPage > pagination.pageCount) pagination.currentPage = Math.max(1, pagination.pageCount);
        function buildQuery(currentPage) {
            var query = queryCallback ? queryCallback() : {};
            if (paramCallback) {
                query = paramCallback(query, { currentPage: currentPage, pageSize: pagination.pageSize });
            } else {
                query.pagination = { currentPage: currentPage, pageSize: pagination.pageSize };
            }
            if (query.pagination) delete query.Pagination;
            return query;
        }
        var query = buildQuery(pagination.currentPage);
        store.set('query', query);
        if (!noNeedFixCurrenctUrl) //IF 不需要fix url，则不设置对应的链接
            //utils.rebuildUrl(query);
            utils.setUrl(query);
        var unfolds = store.get('unfolds');
        if (unfolds) {
            // find the cell and click
            for (var i = 0, length = unfolds.length; i < length; i++) {
                (function (i) {
                    setTimeout(function () {
                        $('#' + unfolds[i] + ' td:nth-child(2)').trigger('click');
                        store.remove('unfolds');
                    }, 0);
                })(i);
            }
        }
        var row = store.get('row');
        if (row) {
            setTimeout(function () {
                row = '#' + row;
                (function checkElemExisting(tries) {
                    if (tries <= 0) return;
                    tries--;
                    if ($(row).length == 0) setTimeout(checkElemExisting, 200);
                    else {
                        var rowElem = $(row), origBackgroundColor = rowElem.css('background-color') || 'transparent';
                        rowElem.animate({ 'background-color': '#f7f6be' }, 'fast').animate({ 'background-color': origBackgroundColor }, 3000);
                    }
                })(30);
                store.remove('row');
            }, 10);
        }

        var beginPage = Math.min(pagination.currentPage - (pagination.currentPage - 1) % 10, Math.max(pagination.pageCount - 9, 1));
        $elem.paginate($.extend({}, GMK.Features.FeatureBase._paginateOptions, {
            begin: beginPage,
            count: pagination.pageCount,
            start: pagination.currentPage,
            display: pagination.pageSize,
            itemCount: pagination.totalCount,
            onChange: function (page, begin, pageSize) {
                if (page == pagination.currentPage && pageSize == pagination.pageSize) {
                    return;
                }
                GMK.Features.FeatureBase._paginateOptions.begin = begin;
                pagination.pageSize = pageSize;
                var query = buildQuery(page);
                // Use post method here due to the Pagination is a complex property, get method will not serialize it.
                utils.responseStateChange(false);
                GMK.Features.FeatureBase._get(searchUrl, query, function (data) {
                    normalizeData(data);
                    var p = data.pagination || data.data.pagination;
                    if (p) normalizePagination(p);
                    if (paramCallback) {
                        query = paramCallback(query, $.extend({}, data.pagination || data.data.pagination));
                    } else {
                        query.pagination = $.extend({}, data.pagination || data.data.pagination);
                    }
                    store.set('query', query);
                    //utils.rebuildUrl(query);
                    //utils.setUrlQuery(query);
                    fillCallback(data);
                }, true);
            }
        }));
    },
    _p: function (pagination, searchUrl, fillCallback, queryCallback, noNeedFixCurrenctUrl) {
        GMK.Features.FeatureBase._paginate($('#gmk-pager'), pagination, queryCallback || function () {
            return utils.serialize("#searchForm .gmk-data-field");
        }, searchUrl, fillCallback, null, noNeedFixCurrenctUrl);
    },
    _pagination: function () {
        var options = arguments.length === 1 ? arguments[0] : {
            $elem: arguments[0],
            pageCount: arguments[1],
            itemCount: arguments[2],
            pageSize: arguments[5],
            currentPage: arguments[3],
            changePage: arguments[4]
        };
        var pageCount = utils.round(+options.pageCount),
            currentPage = utils.round(+options.currentPage),
            itemCount = utils.round(+options.itemCount),
            originalPageSize = utils.round(+options.pageSize),
            $elem = options.$elem,
            changePage = options.changePage;
        if (!$.isNumeric(pageCount) || pageCount < 1) {
            pageCount = 1;
        }
        if (!$.isNumeric(currentPage) || currentPage < 1 || currentPage > pageCount) {
            currentPage = 1;
        }
        if (!$.isNumeric(itemCount) || itemCount < 0) {
            itemCount = 0;
        }
        if (!$.isNumeric(originalPageSize) || originalPageSize < 1) {
            originalPageSize = 1;
        }
        var beginPage = Math.min(currentPage - (currentPage - 1) % 10, Math.max(pageCount - 9, 1));
        $elem.paginate($.extend({}, GMK.Features.FeatureBase._paginateOptions, {
            begin: beginPage,
            count: pageCount,
            start: currentPage,
            itemCount: itemCount,
            display: originalPageSize,
            onChange: function (page, b, pageSize) {
                var newPage = Math.max(utils.round((+page)), 1);
                var newPageSize = Math.max(utils.round((+pageSize)), 1);
                if (newPage != currentPage || newPageSize != originalPageSize) {
                    changePage(newPage, newPageSize);
                }
            }
        }));
    },
};
GMK.Features.CommonModels = function (callback, fromSession) {
    if (!callback) {
        return;
    }
    var self = this;
    var defaults = {
        decimalDigits: 2,
        weightDigits: 4
    };
    var ex = {
        findById: function (source, id) {
            if (source && id !== undefined) {
                for (var i = 0; i < source.length; i++) {
                    if (source[i].id == id) return source[i];
                }
            }
            return null;
        },
        findCommodityType: function (commodityTypeId) {
            return (self.findById(self.AllCommodityTypes, commodityTypeId) || {}).name || '';
        },
        findCommodityTypeByCommodity: function (commodityId) {
            return self.findCommodityType((self.findById(self.AllCommodities, commodityId) || {}).commodityTypeId);
        },
        findCommodity: function (id) {
            var result = self.findById(self.AllCommodities, id);
            return result ? result.name || '' : "";
        },

        findComponentVarieties: function (id) {
            var commodity = self.findById(self.AllCommodities, id) || {};
            var componentVarieties = commodity.varieties;
            return componentVarieties || [];
        },
        findComponentName: function (commodityId, componentId) {
            if (commodityId && componentId) {
                var commodity = self.findById(self.AllCommodities, commodityId) || {};
                var component = self.findById(commodity.varieties, componentId)
                return component ? component.name : '';
            }
        },
        //找到有计价品类的成分
        findCommodityPricingVarieties: function (id) {
            var commodity = self.findById(self.AllCommodities, id);

            if (!commodity) {
                return [];
            }
            var varieties = [];
            var varietyIds = [];
            //成分计价
            if (commodity.pricingMode === self.Enums.PricingMode.Composition) {
                var allVarieties = commodity.varieties;
                //有计价品类的成分
                var pricingVarieties = _.filter(allVarieties, function (d) {
                    return d.pvId;
                });
                //Map有计价品类的成分Id
                varietyIds = _.map(pricingVarieties, function (d) {
                    return d.pvId;
                });
            } else {
                varietyIds = [commodity.commodityTypeId];
            }
            varieties = _.filter(self.AllCommodityTypes, function (d) {
                return varietyIds.indexOf(d.id) > -1;
            });
            if (commodity.pricingMode === self.Enums.PricingMode.Composition) {
                _.forEach(varieties, function (o) {
                    var obj = _.find(allVarieties, function (p) {
                        return o.id === p.pvId;
                    })
                    o.priority = obj && obj.priority
                })
                varieties = _.sortBy(varieties, 'priority')
            }
            return varieties || [];
        },
        findCommodityDisplayName: function (id) {
            var result = self.findById(self.AllCommodities, id);
            return result ? result.displayName || '' : "";
        },
        findPriceScale: function (commodityId, cargoUnitId, moneyUnitId) {
            return _.chain(self.PriceScaleConfigurations)
                .filter(function (r) {
                    return (!r.commodityId || r.commodityId === commodityId)
                        && (!r.cargoUnitId || r.cargoUnitId === cargoUnitId)
                        && (!r.moneyUnitId || r.moneyUnitId === moneyUnitId);
                })
                .map(function (r) {
                    return r.scale;
                })
                .head()
                .value();
        },
        findCargoScale: function (commodityId, mainQuantityUnitId) {
            if (ko.isObservable(commodityId) || ko.isObservable(mainQuantityUnitId)) {
                return ko.computed(function () {
                    return findCargoScaleImpl(ko.isObservable(commodityId) ? commodityId() : commodityId, ko.isObservable(mainQuantityUnitId) ? mainQuantityUnitId() : mainQuantityUnitId);
                });
            } else {
                return findCargoScaleImpl(commodityId, mainQuantityUnitId);
            }

            function findCargoScaleImpl(commodityId, mainQuantityUnitId) {
                return (utils.find(self.AllCommodityMainQuantityUnits, function (r) {
                    return r.commodityId === commodityId && r.mainQuantityUnitId === mainQuantityUnitId;
                }) || {}).scale;
            }
        },
        // obsolete
        findWeightPrecision: function (commodityId) {
            function findWeightPrecisionInternal(id) {
                return defaults.weightDigits;
                //return (self.findById(self.AllCommodities, id) || {}).weightDigts || defaults.weightDigits;
            }
            if (ko.isObservable(commodityId)) {
                return ko.computed(function () {
                    return findWeightPrecisionInternal(commodityId());
                });
            } else {
                return findWeightPrecisionInternal(commodityId);
            }
        },
        findBrandOriginEntity: function (id, commodityOrId) {
            var commodity = (commodityOrId && commodityOrId.brands) ? commodityOrId : self.findById(self.AllCommodities, commodityOrId);
            return (commodity && commodity.brands) ? self.findById(commodity.brands, id) : self.findById($.map(self.AllCommodities, function (r) {
                return r.brands;
            }), id);
        },
        findBrand: function (id, commodityOrId) {
            return (self.findBrandOriginEntity(id, commodityOrId) || {}).brand || '';
        },
        findBrandName: function (id, commodityOrId) {
            return (self.findBrandOriginEntity(id, commodityOrId) || {}).brandName || '';
        },
        _findMaterial: function (id, commodityId) {
            var meterial = self.findById(self.AllMaterials, id);
            return (commodityId && meterial && commodityId !== meterial.commodityId) ? null : meterial;
            //return _.filter(self.AllMaterials, function (r) {
            //    return r.id === id && (!commodityId || commodityId === r.commodityId);
            //})[0];
        },
        findSpecification: function (id, commodityOrId) {
            if (_.isObject(commodityOrId)) {
                return (self.findById(commodity.specifications, id) || {}).name || '';
            } else {
                return (self._findMaterial(id, commodityOrId) || {}).name || '';
            }
            //var commodity = !(commodityOrId && commodityOrId.specifications) ? self.findById(self.AllCommodities, commodityOrId) : commodityOrId; // if Id, find Commodity first.
            //if (commodity) {
            //    var result = self.findById(commodity.specifications, id);
            //    return result ? result.name || '' : "";
            //} else {
            //    return (self.findById($.map(self.AllCommodities, function (r) {
            //        return r.specifications;
            //    }), id) || {}).name || '';
            //}
        },
        findMaterialPropertyType: function (builtInKey) {
            return (utils.find(self.AllMaterialPropertyTypes, function (r) {
                return r.builtInKey === builtInKey;
            }) || {}).value;
        },
        findMaterialPropertyByKey: function (id, key) {
            return (self._findMaterial(id, null) || {})[self.findMaterialPropertyType(key)] || '';
            ////根据key返回产品名称 或者 规格 或者 品类
            //var ptlProperties = (self.findById(self.AllEntityProperties, id) || {}).ptlProperties;
            //var result = _.find(ptlProperties, function (r) { return r.propertyKey === key; });
            //return (result || {}).propertyValue
        },
        _findCompany: function (id) {
            return self.findById(self._AllCompanies, id);
        },
        findCompany: function (id) {
            return (self._findCompany(id) || {}).name || '';
        },
        findCompanyShortName: function (id) {
            return (self._findCompany(id) || {}).shortName || '';
        },
        findCustomer: function (id) {
            var result = self.findById(self._AllCustomers, id);
            return result && result.name || this.findCompany(id);
        },
        findGroup: function (id) {
            var result = self.findById(self._AllCompanyGroups, id);
            return result && result.name || this.findCompany(id);
        },
        //findLogistics: function (id) {
        //    var result = self.findById(self._AllLogistics, id);
        //    return result && result.name || this.findCompany(id);
        //},
        findCorporation: function (id) {
            var result = self.findById(self._AllCorporations, id);
            return result && result.name;
        },
        findCorporationShortName: function (id) {
            var result = self.findById(self._AllCorporations, id);
            return result && result.shortName;
        },
        findCorporationAccount: function (id, corporationId) {
            var result, corporation = self.findById(self._AllCorporations, corporationId);

            $.each((corporation || {}).accounts || [], function (i, item) {
                if (item.id == id) {
                    result = item;
                    return false;
                }
            });

            return result || { id: '', number: '', bank: '', address: '', type: '' };
        },
        findPayType: function (id) {
            //var result = self.findById(self.AllPayTypes, id);
            //return result ? result.name : "";
            return self.findEnumOptionText('PaymentFormType', id);
        },
        findContractType: function (id) {
            var result = self.findById(self.AllContractTypes, id);
            return result ? result.name || '' : "";
        },
        getMappingBusinessTypeByContractType: function (id) {
            var result = '';
            switch (id) {
                case self.Enums.ContractType.Delivery:
                    result = "交割";
                    break;
                case self.Enums.ContractType.NormalContract:
                case self.Enums.ContractType.LongContract:
                case self.Enums.ContractType.LongContractDetail:
                    result = "贸易";
                    break;
                case self.Enums.ContractType.PledgeContract:
                    result = "质解押";
                    break;
                default:
                    result = '';
                    break;
            }
            return result;
        },
        findCreditRating: function (id) {
            var result = self.findById(self.AllCreditRatings, id);
            return result ? result.name || '' : '';
        },
        findExchange: function (id) {
            var result = self.findById(self._AllExchanges, id);
            return result && result.name || this.findCompany(id);
        },
        findWarehouse: function (id) {
            var result = self.findById(self._AllWarehouses, id);
            return result ? result.name || '' : "";
        },
        findWarehouseShortName: function (id) {
            var result = self.findById(self._AllWarehouses, id);
            return result ? result.shortName || result.name || '' : "";
        },
        findWarehouseByShortName: function (shortName) {
            var result = $.grep(self._AllWarehouses, function (item) { return item.shortName == shortName; });
            return result.length == 1 ? result[0].id : '';
        },
        findBankAccount: function (companyBankAccountId) {
            return companyBankAccountId && (self.ListCompanyBankAccounts({
                companyBankAccountId: companyBankAccountId
            })[0] || {}).number || ' ';
        },
        _findUnit: function (id) {
            return utils.find(self.AllUnits, function (r) {
                return r.id === id;
            });
        },
        findUnitSymbol: function (id) {
            return (self._findUnit(id) || {}).symbol || '';
        },
        findUnitName: function (id) {
            return (self._findUnit(id) || {}).name || '';
        },
        findUnitEnglishName: function (id) {
            return (self._findUnit(id) || {}).englishName || '';
        },
        findUnitInformalSymbol: function (id) {
            return (self._findUnit(id) || {}).informalSymbol || '';
        },
        findUnitInformalName: function (id) {
            return (self._findUnit(id) || {}).informalName || '';
        },
        findUnitInformalEnglishName: function (id) {
            return (self._findUnit(id) || {}).informalEnglishName || '';
        },
        findContextMainQuantityUnits: function (commodityId) {
            return self.findMainQuantityUnits(commodityId, (self.CurrenctContext || {
            }).tradeType);
        },
        findMainQuantityUnits: function (commodityId, tradeType) {
            tradeType = tradeType || 15;
            var commodityMainQuantityUnits = $.grep(self.AllCommodityMainQuantityUnits, function (r) {
                return r.commodityId === commodityId && (r.tradeType & tradeType) > 0;
            });
            var mainQuantityUnitIds = $.map(commodityMainQuantityUnits, function (r) {
                return r.mainQuantityUnitId;
            });
            var mainQuantityUnits = $.grep(self.AllUnits, function (r) {
                return $.inArray(r.id, mainQuantityUnitIds) !== -1;
            }).sort(function (a, b) {
                return $.inArray(a.id, mainQuantityUnitIds) - $.inArray(b.id, mainQuantityUnitIds);
            });

            return mainQuantityUnits;
        },
        findCommodityTypeUnits: function (commodityTypeId, quantityTypeId) {
            var commodityType = self.findById(self.AllCommodityTypes, commodityTypeId);
            if (!commodityType) {
                return [];
            }
            var unitIds = _.map(_.filter(commodityType.quantityConfs, function (c) {
                return c.quantityTypeId === quantityTypeId || !quantityTypeId;
            }), function (c) { return c.unitId; });
            var units = _.map(unitIds, function (item) {
                return _.find(self.AllUnits, function (o) {
                    return item === o.id
                });
            });
            return units;
        },
        cargoQuantityConversionFactor: function (toUnitId, fromUnitId) {
            if (toUnitId === fromUnitId) {
                return 1;
            }
            return +(utils.find(self.AllUnitConversions, function (r) {
                return r.toUnitId === toUnitId && r.fromUnitId === fromUnitId;
            }) || {}).factor;
        },
        quantityConvert: function (toUnitId, fromUnitId, fromUnitQuantityNumericValue) {
            return utils.multiply(fromUnitQuantityNumericValue, self.cargoQuantityConversionFactor(toUnitId, fromUnitId));
        },
        quantityConvertAndRound: function (commodityId, toUnitId, fromUnitId, fromUnitQuantityNumericValue) {
            var fromUnitQuantityNumericValueRounded = self.roundCargoWeight(commodityId, fromUnitId, fromUnitQuantityNumericValue);
            var toUnitQuantityNumericValue = self.quantityConvert(toUnitId, fromUnitId, fromUnitQuantityNumericValueRounded);
            return self.roundCargoWeight(commodityId, toUnitId, toUnitQuantityNumericValue);
        },
        listCargoInseparability: function (inventoryStorageType, commodityId, tradeType) {
            return $.map($.grep(self.CargoInseparabilityConfigurations, function (r) {
                return (!inventoryStorageType || (r.inventoryStorageType & inventoryStorageType) > 0) &&
                    (!r.commodityId || !commodityId || r.commodityId === commodityId) &&
                    (!tradeType || (r.tradeType & tradeType) > 0);
            }), function (r) {
                return r.cargoInseparability;
            });
        },
        listCargoInseparabilityOptions: function (inventoryStorageType, commodityId, tradeType) {
            var values = self.listCargoInseparability(inventoryStorageType, commodityId, tradeType);
            return $.grep(self.EnumOptions.CargoInseparability, function (r) {
                return $.inArray(r.value, values) !== -1;
            }).slice().sort(function (a, b) {
                return $.inArray(a.value, values) - $.inArray(b.value, values);
            });
        },
        findExpress: function (id) {
            var result = self.findById(self.AllExpressageCompanies, id);
            return result ? result.name || '' : "";
        },
        getGeneralCustomers: function (costFeeType) {
            return costFeeType === self.Enums.CostFeeType.Logistics ? self._AllWarehousingCompany : costFeeType === self.Enums.CostFeeType.WarehouseFee ? self._AllWarehousingCompany : self._AllCustomers.concat(self._AllWarehousingCompany).concat(self._AllCorporations);
        },
        findBank: function (id, customerOrId, costFeeType) {
            var customers = this.getGeneralCustomers(costFeeType);
            var customer = (customerOrId && customerOrId.accounts) ? customerOrId : self.findById(customers, customerOrId); // if Id, find first.
            var accounts = (customer || {}).accounts || $.map(self._AllCompanies, function (r) {
                return r.accounts;
            });
            return self.findById(accounts, id) || {
                id: '', number: '', bank: '', address: '', type: ''
            };
        },
        findInstrument: function (id) {
            if (isNaN(id)) {
                return id;
            } else {
                var result = self.findById(self.AllInstruments(), id);
                return result ? result.code || '' : "";
            }
        },
        findInstrumentCategory: function (id) {
            if (isNaN(id)) {
                return id;
            } else {
                var result = self.findById(self._AllInstrumentCategories, id) || {};
                return result.code;
            }
        },
        findUser: function (id) {
            if (isNaN(id)) {
                return id;
            } else {
                var result = _.find(self._AllUsers, function (d) {
                    return d.value === +id;
                }) || {};
                return result.text;
            }
        },
        findDepartment: function (id) {
            return (self.findById(self.AllDepartments, id) || {
            }).name || '';
        },
        findAccountingEntity: function (id) {
            var result = self.findById(self.ListDepartments({
                forBusiness: false,
                forBusinessDepartment: false,
                forAccounting: false
            }), id);
            return result ? result.name : '';
        },
        listInstruments: function (params) {
            params = $.extend({
                //includeIneffective: true,
                instrumentCategoryId: null,
                commodityTypeId: null,
                commodityId: null,
                exchangeId: null,
                currencyId: null,
                unitId: null,
                periodType: null,
                instrumentType: null,
                nonePeriodOrContinuous: null,
                filterTradingDate: false,
                date: undefined,
            }, params);
            if (!params.commodityTypeId && params.commodityId) {
                params.commodityTypeId = (self.findById(self.AllCommodities, params.commodityId) || {}).commodityTypeId;
            }
            return $.grep(self.AllInstruments(), function (r) {
                return (!params.instrumentCategoryId || params.instrumentCategoryId === r.instrumentCategoryId)
                    && (!params.commodityTypeId || params.commodityTypeId === r.commodityTypeId)
                    && (!params.exchangeId || params.exchangeId === r.exchangeId)
                    && (!params.currencyId || params.currencyId === r.currencyId)
                    && (!params.unitId || params.unitId === r.unitId)
                    && (!params.periodType || params.periodType === r.periodType)
                    && (!params.instrumentType || params.instrumentType === r.instrumentType)
                    && (!params.nonePeriodOrContinuous || (r.periodType === self.Enums.InstrumentPeriodType.None || r.instrumentType === self.Enums.SpecialInstrumentType.Continuous) === !!params.nonePeriodOrContinuous)
                    && (!params.filterTradingDate || !r.lastTradingDay || (moment(params.date || undefined).startOf('day') - moment(r.lastTradingDay).startOf('day') <= 0))
                    ;
            });
        },
        findInstrumentsByCommodityType: function (commodityTypeId) {
            return $.grep(self.AllInstruments(), function (r) {
                return r.commodityTypeId == commodityTypeId
            });
        },
        findInstruments: function (commodityId) {
            var result = [];
            var commodity = self.findById(self.AllCommodities, commodityId);
            if (commodity) {
                var commodityTypeId = commodity.commodityTypeId;
                return self.findInstrumentsByCommodityType(commodityTypeId);
            }
            return result;
        },
        findInstrumentByDate: function (instruments, date) {
            var d = moment(date).startOf('day');
            return utils.find(instruments, function (r) {
                return moment(r.currentStartDate).startOf('day') - d <= 0 && d - moment(r.lastTradingDay).startOf('day') <= 0;
            });
        },
        findDateCodeInstrument: function (code, instruments) {
            if (code) {
                var instrumentDate = utils.parseDate(code);
                var instrument = null;
                $.each(instruments || self.AllInstruments(), function (i, r) {
                    var iDate = utils.parseDate(r.code);
                    if (iDate != null)
                        if (instrumentDate.getFullYear() == iDate.getFullYear() && instrumentDate.getMonth() == iDate.getMonth() && instrumentDate.getDate() == iDate.getDate()) {
                            instrument = r;
                            return instrument;
                        }
                });
                return instrument;
            }
        },
        findSalers: function (commodityId) {
            var commodity = $.grep(self.AllCommodities, function (r) {
                return r.id === commodityId;
            })[0];
            return commodity && (commodity.salers.length ? commodity.salers : commodity.allSalers) || [];
        },
        findSaler: function (id) {
            return $.map($.grep(self.AllSalers, function (r) {
                return r.id === id;
            }), function (r) {
                return r.name;
            })[0] || '';
        },
        findExecutor: function (id) {
            return $.map($.grep(self.AllExecutors, function (r) {
                return r.id === id;
            }), function (r) {
                return r.name;
            })[0] || '';
        },
        findAccountingEntitiesByCommodityId: function (commodityId) {
            var accountingEntityIds = $.map($.map($.grep(self.AllCommodities, function (r) {
                return r.id === commodityId || !commodityId;
            }), function (r) {
                return r.businessDepartments || [];
            }), function (r) {
                return r.accountEntityIds || [];
            });
            return $.grep(self.AllDepartments, function (r) {
                return $.inArray(r.id, accountingEntityIds) !== -1;
            });
        },
        findPriceType: function (id) {
            return self.findEnumOptionText('PriceCalculationType', id);
        },
        findCurrency: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).name || '';
        },
        findCurrencyScale: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).scale;
        },
        findCurrencyShortName: function (id) {
            return (self.findById(self.AllCurrencies, id) || {}).shortName || '';
        },
        findCurrencyFullName: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).fullName || '';
        },
        findCurrencyCode: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).code || '';
        },
        findCurrencySymbol: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).symbol || '';
        },
        findCurrencyEnglishName: function (id) {
            return (self.findById(self.AllCurrencies, id) || {
            }).englishName || '';
        },
        findConfTaxRate: function (id) {
            return (self.findById(self.AllTaxRates, id) || {}).taxRate || '';
        },
        getMaxGapAmount: function (currencyId, _MaxAmountGapRatio) {
            //TODO:将_MaxAmountGapRatio的值做成配置项，目前默认是20倍
            var scale = self.findCurrencyScale(currencyId) || 2;
            return 1 / Math.pow(10, scale) * (_MaxAmountGapRatio || 20);
        },
        roundCargoWeight: function (commodityId, unitId, weight, roundingMode) {
            var scale = self.findCargoScale(commodityId, unitId);
            return utils.roundWeight(weight, scale, roundingMode);
        },
        roundCurrencyAmount: function (currencyId, amount, roundingMode) {
            var scale = self.findCurrencyScale(currencyId);
            return utils.roundAmount(amount, scale, roundingMode);
        },
        roundPrice: function (commodityId, cargoUnitId, moneyUnitId, price, roundingMode) {
            //价格计算按照品种的价格精度进行保留小数位数 若没配置则保留两位小数
            var scale = _.isNil(self.findPriceScale(commodityId, cargoUnitId, moneyUnitId)) ? 2 : self.findPriceScale(commodityId, cargoUnitId, moneyUnitId);
            return utils.round(price, scale, roundingMode);
        },
        formatCargoWeight: function (commodityId, unitId, weight, thousands) {
            var scale = self.findCargoScale(commodityId, unitId);
            return utils.formatWeight(weight, scale, thousands);
        },
        formatCurrencyAmount: function (currencyId, amount, thousands) {
            var scale = self.findCurrencyScale(currencyId);
            return utils.formatAmount(amount, scale, thousands);
        },
        formatPrice: function (commodityId, cargoUnitId, moneyUnitId, price, thousands) {
            var scale = self.findPriceScale(commodityId, cargoUnitId, moneyUnitId);
            return utils.formatNumber(price, scale, thousands);
        },
        uppercaseAmount: function (amount, currencyId) { //根据币种不同初始化大写
            var currency = self.findById(self.AllCurrencies, currencyId);
            switch (currency.name) { //默认返回美元的大写格式，可后续支持多种大写格式
                case '人民币':
                    return utils.uppercaseAmount(amount);
                case '美元':
                    return utils.uppercaseAmountEn(amount);
                default:
                    return utils.uppercaseAmountEn(amount);
            }
        },
        findFutureExcutor: function (id) {
            var result = self.findById([], id);
            return result ? result.name || '' : "";
        },
        findEnumOptionText: function (enumOptions, value) {
            if (typeof enumOptions === 'string') {
                enumOptions = self.EnumOptions[enumOptions];
            }
            var option;
            if (enumOptions && enumOptions.length) {
                option = utils.find(enumOptions, function (x) {
                    return x.value == value;
                });
            }
            return option ? option.text || '' : '';
        },
        isBank: function (companyType) {
            return ((companyType & self.Enums.CorporationTypeFlag.Bank) > 0);
        },
        AllInstruments: function () {
            if (self._allInstruments == null) {
                var host = window.location.host;
                var userName = GMK.Context.UserName

                var storageKey = "{0}_{1}_instruments".format(host, userName);
                var temp = $.ajaxSettings.async;
                $.ajaxSetup({
                    cache: true,
                    async: false
                });
                var versionKey = "{0}_{1}_instruments_version".format(host, userName);
                var originVersion = localStorage.getItem(versionKey);
                var allInstruments = null;
                var lastestVersion = null;
                ajax._get('SystemConfig/InstrumentVersion', null, function (result) {
                    lastestVersion = result.data;
                    if (originVersion === lastestVersion) {
                        allInstruments = JSON.parse(localStorage.getItem(storageKey));
                        if (!allInstruments || !allInstruments.length) {
                            allInstruments = self._getInstruments(lastestVersion, userName);
                        }
                    } else {
                        allInstruments = self._getInstruments(lastestVersion, userName);
                    }
                });
                localStorage.setItem(versionKey, lastestVersion);
                //localStorage.setItem(storageKey, JSON.stringify(allInstruments));
                $.ajaxSetup({
                    cache: false,
                    async: temp
                });
                return self._allInstruments = allInstruments;
            }
            return self._allInstruments;
        },
        _getInstruments: function (instrumentVersion, userName) {
            var instruments = [];
            ajax._get('Service/AllInstruments?' + instrumentVersion + '_' + userName, {
            }, function (result) {
                instruments = result.Data;
                _.each(instruments, function (r) {
                    r.category = _.find(self.AllInstrumentCategories, function (r2) {
                        return r2.id === r.instrumentCategoryId;
                    });
                });
            });
            return instruments;
        },
        getEnPaymentType: function (type) {
            var types = self.Enums.ExchangeProcessType;
            var value = '';
            switch (type) {
                case types.ConditionalRelease:
                    value = 'C/R';
                    break;
                case types.DocumentsAgainstPayment:
                    value = 'D/P';
                    break;
                case types.DocumentsAgainstAcceptance:
                    value = 'D/A';
                    break;
                case types.LetterOfCredit:
                    value = 'LC';
                    break;
                case types.AmountFirst:
                case types.SpotFirst:
                case types.FaceToFace:
                    value = 'T/T';
                    break;
            }
            return value;
        },
        //// obsolete
        //formatUnitPrice: function (currencyId, unitId, amount, format) {
        //    var currencyCode = self.findCurrencyCode(currencyId);
        //    var unitCode = self.findUnitCode(unitId);
        //    var amountText = self.formatCurrencyAmount(currencyId, amount);
        //    return (format || '{0} {2}/{1}').format(currencyCode, unitCode, amountText);
        //},
        formatPriceAndUnit: function (params) {
            var commodityId = params.commodityId;
            var cargoUnitId = params.cargoUnitId;
            var moneyUnitId = params.moneyUnitId;
            var price = params.price;
            var thousands = params.thousands;
            var format = params.format || '{0} {1}/{2}';
            var negativeFormat = params.negativeFormat;
            var findCurrency = params.findCurrency || self.findCurrencyShortName;
            var findUnit = params.findUnit || self.findUnitName;
            var moneyUnitCode = findCurrency(moneyUnitId) || '';
            var cargoUnitCode = findUnit(cargoUnitId) || '';
            return (price < 0 && negativeFormat)
                ? negativeFormat.format(self.formatPrice(commodityId, cargoUnitId, moneyUnitId, -price, thousands) || '', moneyUnitCode, cargoUnitCode)
                : format.format(self.formatPrice(commodityId, cargoUnitId, moneyUnitId, price, thousands) || '', moneyUnitCode, cargoUnitCode);
        },
        formatPriceAndUnitInformal: function (params) {
            return self.formatPriceAndUnit($.extend({
                findCurrency: self.findCurrencyCode,
                findUnit: self.findUnitCode
            }, params));
        },
        formatPriceAndUnitBroken: function (params) {
            return self.formatPriceAndUnit($.extend({
                findCurrency: self.findCurrencyCode,
                findUnit: self.findUnitCode,
                format: '{1} {0}/{2}',
                negativeFormat: '-{1} {0}/{2}'
            }, params));
        },
        getExecutors: function (fun) {
            var key = fun + '_' + window.GMK.Context.TradeType + '_' + window.GMK.Context.CorporationId;
            if (!self._allOperators || !self._allOperators[key]) {
                var temp = $.ajaxSettings.async;
                $.ajaxSetup({
                    cache: true,
                    async: false
                });
                ajax._get('Service/GetOperatorsByFun', {
                    functionName: fun
                }, function (result) {
                    self._allOperators = {};
                    self._allOperators[key] = result.Data || [];
                    return self._allOperators[key];
                }, undefined, true);
                $.ajaxSetup({
                    cache: false,
                    async: temp
                });
            }
            return self._allOperators ? self._allOperators[key] : [];
        },
        findPremiumDisplayText: function (commodityId, corpId, displayTexts) {
            var text = displayTexts.defaultValue;
            var filterText = ($.grep(displayTexts.details, function (d) {
                return d.commodityId == commodityId && d.corpId === corpId;
            })[0] || {}).value;
            if (filterText) {
                text = filterText;
            }
            return text;
        },
        generateBill: function (tempType, dsId, commodityId, url, cb, childWindow, downloadInChildWindow, openChildWindow) {
            return function (data, event) {
                var child = childWindow || utils.openWindow();
                self._generateBill(tempType, dsId, url, cb, child, downloadInChildWindow, openChildWindow, null, commodityId);
            }
        },
        _generateBill: function (tempType, dsId, url, onFail, childWindow, downloadInChildWindow, openChildWindow, onSuccess, commodityId) {
            ajax._get("Template/ValidateBeforeGenerate", { templateType: tempType, dataSourceId: dsId }, function (result) {
                if (result.message) {
                    utils.alert(result.message, function () {
                        onFail && onFail();
                    });
                    return;
                } else {
                    if (downloadInChildWindow) {
                        if (openChildWindow) {
                            (childWindow || utils.openWindow()).redirectTo(utils.url("ArchiveIndex", "Template", { templateType: tempType, dataSourceId: dsId, url: url, downloadInChildWindow: true, commodityId: commodityId }));
                        } else {
                            location.href = utils.url("ArchiveIndex", "Template", { templateType: tempType, dataSourceId: dsId, url: url, downloadInChildWindow: true, commodityId: commodityId });
                        }
                    } else {
                        (childWindow || utils.openWindow()).redirectTo(utils.url("ArchiveIndex", "Template", { templateType: tempType, dataSourceId: dsId, url: url }));
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            });
        },
        findTrader: function (id) {
            return (self.findById(self.AllTraders, id) || {
            }).name || '';
        },
    }

    self.settings = self.settings || {
    };
    $.extend(self.settings, defaults);
    BigDecimal.prototype.plainMC.digits = 30;

    var ajax = GMK.Features.FeatureBase;
    var commonModelVersion = sessionStorage.getItem("cmv");
    //since the common models are so big, so cache it; but do not cache any other thing
    $.ajaxSetup({
        cache: true
    });
    if (!fromSession) {
        ajax._get('Service/CommonModels?' + commonModelVersion + '_' + userName, {
        }, function (result) {
            processCommonModels(result.data);
        }, null, true);
    } else {
        var cachedCommonModels = JSON.parse(sessionStorage.getItem(host + "cm"));
        processCommonModels(cachedCommonModels);
    }

    function processCommonModels(data) {
        var corporationId = GMK.Context.CorporationId;
        var tradeType = GMK.Context.TradeType;
        var models = data;
        sessionStorage.setItem(host + "cm", JSON.stringify(data));
        sessionStorage.setItem(host + "ccm", true);
        models._AllCompanies = models.AllCompanies;
        models._AllCommodityTypes = models.AllCommodityTypes;
        models._AllInstrumentCategories = models.AllInstrumentCategories;
        models._AllUsers = models.allUsers;
        models.CurrenctContext = {
            tradeType: GMK.Context.TradeType,
            corporationId: GMK.Context.CorporationId,
        },
            $.each(models.AllBusinesses, function (i, r1) {
                r1.forContext = r1.corporationId == corporationId && (r1.tradeType & tradeType) != 0;
                r1.commodity = utils.find(models.AllCommodities, function (r2) {
                    return r2.id === r1.commodityId;
                }) || {};
                r1.department = utils.find(models.AllDepartments, function (r2) {
                    return r2.id === r1.departmentId;
                }) || {
                    };
                r1.corporation = utils.find(models._AllCompanies, function (r2) {
                    return r2.id === r1.corporationId;
                }) || {
                    };
                r1.commodityName = r1.commodity.name || '';
                r1.departmentName = r1.department.name || '';
                r1.corporationName = r1.corporation.shortName || '';
                r1.tradeTypeNote = models.Enums.FullTradeType._Notes[r1.tradeType];
                r1.simpleTradeTypeNote = models.Enums.FullTradeType._Notes[r1.simpleTradeType];
                r1.name = '内外贸方式：' + r1.tradeTypeNote + '，公司：' + r1.corporationName + '，品种：' + r1.commodityName + '，部门：' + r1.departmentName;
                r1.text = r1.corporationName + '-' + models.Enums.SimpleTradeType._Notes[r1.tradeType] + '-' + r1.departmentName + '-' + r1.commodityName;
                r1.salers = $.grep(models.AllSalers, function (r2) {
                    return $.inArray(r1.id, r2.businessIds) !== -1;
                });
            });
        models.ListBusinesses = function (param) {
            param = $.extend({
                disabled: false,
                forUser: false,
                forContext: false,
                tradeType: null,
                corporationId: null,
                commodityId: null,
                departmentId: null
            }, param);
            return $.grep(models.AllBusinesses, function (r) {
                return (param.disabled === null || param.disabled === undefined || r.isDisabled === param.disabled) &&
                    (!param.forUser || r.forUser) &&
                    (!param.forContext || r.forContext) &&
                    (!param.tradeType || (r.tradeType & param.tradeType)) &&
                    (!param.corporationId || r.corporationId === param.corporationId) &&
                    (!param.commodityId || r.commodityId === param.commodityId) &&
                    (!param.departmentId || r.departmentId === param.departmentId);
            });
        };
        models.ListCompanyBankAccounts = function (param) {
            param = $.extend({
                accounts: null,
                companyBankAccountId: null,
                companyId: null,
                //disabled: null // null：缺省不分是否停用， false：缺省仅未停用
                disabled: false
            }, param);
            var companyAccounts = param.accounts || (param.companyId ? (utils.find(models._AllCompanies, function (r) {
                return r.id === param.companyId;
            }) || {}).accounts || [] : $.map(models._AllCompanies, function (r) {
                return r.accounts;
            }));
            var accounts = param.companyBankAccountId ? $.grep(companyAccounts, function (r) {
                return r.id === param.companyBankAccountId;
            }) : companyAccounts;
            if (!param.bussinessParam) {
                return accounts;
            }
            param.bussinessParam = $.extend({
                forUser: false,
                forContext: false,
                tradeType: null,
                corporationId: null,
                commodityId: null,
                departmentId: null
            }, param.bussinessParam);
            var businesses = models.ListBusinesses(param.bussinessParam);
            var businessIds = $.map(businesses, function (r) {
                return r.id;
            });
            var noDisabledParam = param.disabled === null || param.disabled === undefined;
            return $.grep(accounts, function (r) {
                return $.grep(r.businessIds || [], function (r2) {
                    return $.inArray(r2, businessIds) !== -1;
                }).length && (noDisabledParam || r.disabled === param.disabled);
            });
        };
        models.ListCorporations = function (param) {
            param = $.extend({
                forBusiness: true
            }, param);
            var businesses = models.ListBusinesses(param);
            var ids = $.map(businesses, function (r) {
                return r.corporationId;
            });
            return $.grep(models.ListCompanies($.extend({
                metaCompanyType: models.Enums.MetaCompanyType.Corporation,
                relationCategory: models.Enums.CorporationRelationCategory.Internal,
                type: models.Enums.CorporationTypeFlag.Client
            }, param)), function (r) {
                return (!param.forBusiness || $.inArray(r.id, ids) !== -1);
            });
        };
        models.ListCommodities = function (param) {
            param = $.extend({
                forBusiness: true
            }, param);
            var businesses = models.ListBusinesses(param);
            var ids = $.map(businesses, function (r) {
                return r.commodityId;
            });
            return $.grep(models.AllCommodities, function (r) {
                return (!param.forBusiness || $.inArray(r.id, ids) !== -1);
            });
        };
        models.ListDepartments = function (param) {
            param = $.extend({
                forBusiness: true,
                forBusinessDepartment: true,
                forAccounting: false,
            }, param);
            var businesses = models.ListBusinesses(param);
            var ids = $.map(businesses, function (r) {
                return r.departmentId;
            });
            return $.grep(models.AllDepartments, function (r) {
                return (!param.forBusiness || $.inArray(r.id, ids) !== -1) &&
                    (!param.forBusinessDepartment || r.isBusinessDepartment) &&
                    (!param.forAccounting || r.isAccounting);
            });
        };
        models.ListSalers = function (param) {
            param = $.extend({
                forBusiness: true,
                //disabled: null // null：缺省不分是否停用， false：缺省仅未停用
                disabled: false
            }, param);
            var businesses = models.ListBusinesses(param);
            var ids = $.map($.map(businesses, function (r) {
                return r.salers;
            }), function (r) {
                return r.id;
            });
            //var ids = $.map(businesses, function (r) {
            //    return r.id;
            //});
            var noDisabledParam = param.disabled === null || param.disabled === undefined;
            return $.grep(models.AllSalers, function (r) {
                return (!param.forBusiness || $.inArray(r.id, ids) !== -1) && (noDisabledParam || r.disabled === param.disabled);
            });
        };
        models.UserBusinesses = models.ListBusinesses({
            disabled: false,
            forUser: true
        });
        models.ContextBusinesses = models.ListBusinesses({
            disabled: false,
            forContext: true
        });
        models.UserContextBusinesses = models.ListBusinesses({
            disabled: false,
            forUser: true,
            forContext: true
        });
        models.UserBusinessIds = $.map(models.UserBusinesses, function (r) {
            return r.id;
        });
        models.ContextBusinessIds = $.map(models.ContextBusinesses, function (r) {
            return r.id;
        });
        models.UserContextBusinessIds = $.map(models.UserContextBusinesses, function (r) {
            return r.id;
        });
        models.AllBusinessDepartments = models.ListDepartments({
            forBusiness: false,
            forBusinessDepartment: true,
            forAccounting: false
        });
        models.AllAccountingEntities = _.filter(models.ListDepartments({
            forBusiness: false,
            forBusinessDepartment: false,
            forAccounting: true,
        }), function (x) { return x.isAtomicAccounting });
        models.AllAccountEntities = models.AllAccountingEntities;

        var forUserBusinesses = $.grep(models.AllBusinesses, function (r2) {
            return r2.forUser;
        });
        var forContextBusinesses = $.grep(models.AllBusinesses, function (r2) {
            return r2.forContext;
        });
        $.each(models._AllCompanies, function (i, r1) {
            r1.metaCompanyType = r1.metaCompanyType || models.Enums.MetaCompanyType.Corporation;
            r1.relationCategory = r1.relationCategory || models.Enums.CorporationRelationCategory.External;
            r1.typeConfsEnabled = _.filter(r1.typeConfs, function (r2) {
                return !r2.disabled;
            });
            r1.typeConfsDisabled = _.filter(r1.typeConfs, function (r2) {
                return r2.disabled;
            });
            r1.type = _.reduce(r1.typeConfs, function (m, r2) {
                return m | r2.type;
            }, 0);
            r1.typeEnabled = _.reduce(r1.typeConfsEnabled, function (m, r2) {
                return m | r2.type;
            }, 0);
            r1.typeDisabled = _.reduce(r1.typeConfsDisabled, function (m, r2) {
                return m | r2.type;
            }, 0);
            r1.disabled = !r1.typeConfsEnabled.length;
            r1.forUser = $.grep(forUserBusinesses, function (r2) {
                return $.inArray(r2.id, r1.businessIds) !== -1;
            }).length > 0;
            r1.forContext = $.grep(forContextBusinesses, function (r2) {
                return $.inArray(r2.id, r1.businessIds) !== -1;
            }).length > 0;
            $.each(r1.accounts, function (i2, r2) {
                r2.accountEntities = r2.businessIds;
            });
        });
        models.ListCompanies = function (param) {
            param = $.extend({
                metaCompanyType: null,
                relationCategory: null,
                type: null,
                disabled: null,
                forUser: false,
                forContext: false,
            }, param);
            var businesses = !param.forUser && !param.forContext ? models.AllBusinesses : models.ListBusinesses({
                disabled: param.disabled,
                forUser: param.forUser,
                forContext: param.forContext,
            });
            return _.filter(models._AllCompanies, function (r) {
                var typeConfs = _.filter(r.typeConfs, function (r2) {
                    return (!_.isBoolean(param.disabled) || r2.disabled === param.disabled) &&
                        (!param.type || (param.type & r2.type));
                });
                var type = _.reduce(typeConfs, function (m, r2) {
                    return m | r2.type;
                }, 0);

                var businessIds = param.type ? r.businessIds : r.businessIds;
                var hasBusiness = !param.forUser && !param.forContext || _.some(businesses, function (r2) {
                    return _.includes(businessIds, r2.id);
                });

                return (!param.metaCompanyType || param.metaCompanyType === r.metaCompanyType) &&
                    (!param.relationCategory || param.relationCategory === r.relationCategory) &&
                    (!param.type || (param.type & type)) &&
                    (!_.isBoolean(param.disabled) || !typeConfs.length === param.disabled) &&
                    hasBusiness;
            });
        };
        models._AllCompanyGroups = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.CreditGroup
        });
        models._AllCustomersIncludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Client
        });
        models._AllCustomersExcludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.External,
            type: models.Enums.CorporationTypeFlag.Client
        });
        models._AllCustomers = models._AllCustomersExcludeCorporations;
        models._AllBanks = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Bank
        });
        models._AllFinancings = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Financing,
        });
        models._AllExchanges = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Exchange,
        });
        models._AllWarehousingCompany = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.WarehousingCompany,
        });
        var endDate = new Date();
        var sortCorporation = function (a, b) {
            var allCorpIds = $.map(models.AllBusinesses, function (r) {
                return r.corporationId;
            });
            var userCorpIds = $.map(models.UserBusinesses, function (r) {
                return r.corporationId;
            });
            var userContextCorpIds = $.map(models.UserContextBusinesses, function (r) {
                return r.corporationId;
            });
            return ($.inArray(a.id, userContextCorpIds) - ($.inArray(b.id, userContextCorpIds) & (-1 >>> 1)))
                || ($.inArray(a.id, userCorpIds) - ($.inArray(b.id, userCorpIds) & (-1 >>> 1)))
                || ($.inArray(a.id, allCorpIds) - ($.inArray(b.id, allCorpIds) & (-1 >>> 1)));
        };
        models._AllCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.Internal,
            type: models.Enums.CorporationTypeFlag.Client
        }).sort(sortCorporation);
        models._AllWarehouseWarehouses = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.WarehousePlace
        });
        //models._AllLogistics = [];
        //models._AllWarehousesOrLogistics = $.grep(models._AllCompanies, function (r) {
        //    return r.metaCompanyType === models.Enums.MetaCompanyType.WarehousePlace || (r.type & models.Enums.CorporationTypeFlag.Logistics) === models.Enums.CorporationTypeFlag.Logistics;
        //}).sort(function (a, b) {
        //    return (a.type - b.type) || (a.id - b.id);
        //});
        //models._AllWarehousesOrLogistics = models._AllWarehouseWarehouses;
        models._AllWarehouses = models._AllWarehouseWarehouses;

        models._AllExchangesEnabled = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Exchange,
            disabled: false,
        });

        models.UserCompanyGroups = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.CreditGroup,
            forUser: true,
        });
        models.UserCustomersIncludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
        });
        models.UserCustomersExcludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.External,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
        });
        models.UserCustomers = models.UserCustomersExcludeCorporations;
        models.UserBanks = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Bank,
            forUser: true,
        });
        models.UserFinancings = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Financing,
            forUser: true,
        });
        models.UserExchanges = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Exchange,
            forUser: true,
        });
        models.UserWarehousingCompanies = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.WarehousingCompany,
            forUser: true,
        });
        models.UserWarehouseWarehouses = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.WarehousePlace,
            forUser: true,
        });
        //models.UserLogistics = [];
        //models.UserWarehousesOrLogistics = $.grep(models._AllWarehousesOrLogistics, function (r) {
        //    return r.forUser;
        //});
        models.UserWarehouses = models.UserWarehouseWarehouses;

        models.UserContextCompanyGroups = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.CreditGroup,
            forUser: true,
            forContext: true,
        });
        models.UserContextCustomersIncludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
            forContext: true,
        });
        //用户客户 包含法人
        models.UserCustomersIncludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
            forContext: false,
        });
        //用户客户 不包含法人
        models.UserCustomersExcludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.External,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
            forContext: false,
        });

        models.UserContextCustomersExcludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.External,
            type: models.Enums.CorporationTypeFlag.Client,
            forUser: true,
            forContext: true,
        });
        models.UserContextCustomers = models.UserContextCustomersExcludeCorporations;
        models.UserContextBanks = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Bank,
            forUser: true,
            forContext: true,
        });
        models.UserContextFinancings = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Financing,
            forUser: true,
            forContext: true,
        });
        models.UserContextExchanges = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Exchange,
            forUser: true,
            forContext: true,
        });
        models.UserContextWarehousingCompanies = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.WarehousingCompany,
            forUser: true,
            forContext: true,
        });
        models.UserContextWarehouseWarehouses = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.WarehousePlace,
            forUser: true,
            forContext: true,
        });
        //models.UserContextLogistics = $.grep(models.UserLogistics, function (r) {
        //    return r.forContext;
        //});
        //models.UserContextWarehousesOrLogistics = $.grep(models.UserWarehousesOrLogistics, function (r) {
        //    return r.forContext;
        //});
        models.UserContextWarehouses = models.UserContextWarehouseWarehouses;

        models.UserContextEnabledCompanyGroups = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.CreditGroup,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledCustomersIncludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Client,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledCustomersExcludeCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.External,
            type: models.Enums.CorporationTypeFlag.Client,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledCustomers = models.UserContextEnabledCustomersExcludeCorporations;
        models.UserContextEnabledBanks = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Bank,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledFinancings = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Financing,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledExchanges = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.Exchange,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledWarehousingCompanies = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            type: models.Enums.CorporationTypeFlag.WarehousingCompany,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        models.UserContextEnabledWarehouseWarehouses = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.WarehousePlace,
            disabled: false,
            forUser: true,
            forContext: true,
        });
        //models.UserContextEnabledLogistics = $.grep(models.UserContextLogistics, function (r) {
        //    return !r.disabled;
        //});
        //models.UserContextEnabledWarehousesOrLogistics = $.grep(models.UserContextWarehousesOrLogistics, function (r) {
        //    return !r.disabled;
        //});
        models.UserContextEnabledWarehouses = models.UserContextEnabledWarehouseWarehouses;
        models.AllCompanyGroups = models.UserContextEnabledCompanyGroups;
        models.AllCustomersIncludeCorporations = models.UserContextEnabledCustomersIncludeCorporations;
        models.AllCustomersExcludeCorporations = models.UserContextEnabledCustomersExcludeCorporations;
        models.AllCustomers = models.UserContextEnabledCustomers;
        models.AllBanks = models.UserContextEnabledBanks;
        models.AllFinancings = models.UserContextEnabledFinancings;
        models.AllExchanges = models.UserContextEnabledExchanges;
        models.AllWarehouseWarehouses = models.UserContextEnabledWarehouseWarehouses;
        //models.AllLogistics = models.UserContextEnabledLogistics;
        //models.AllWarehousesOrLogistics = models.UserContextEnabledWarehousesOrLogistics;
        models.AllWarehouses = models.UserContextEnabledWarehouses;

        models.AllCorporations = models.ListCompanies({
            metaCompanyType: models.Enums.MetaCompanyType.Corporation,
            relationCategory: models.Enums.CorporationRelationCategory.Internal,
            type: models.Enums.CorporationTypeFlag.Client,
            disabled: false,
        });

        //models.UserCommodityTypes = $.grep(models.AllCommodityTypes, function (r) {
        //    return $.inArray(r.id, models.UserCommodityTypeIds || []) !== -1;
        //});
        //models.UserCommodities = $.grep(models.AllCommodities, function (r) {
        //    return $.inArray(r.id, models.UserCommodityIds || []) !== -1;
        //});
        models.UserCommodities = models.ListCommodities({
            forUser: true,
        });

        //根据用户品种 获取品类ids
        //2020-04-27 添加对于复杂计价品的用户品类列表支持 amy
        var userCommodityTypeIds = [];
        _.each(models.UserCommodities, function (d, i) {
            if (d.varieties && d.varieties.length > 0) {
                _.each(d.varieties, function (r, j) {
                    userCommodityTypeIds.push(r.pvId);
                });
            } else
                userCommodityTypeIds.push(d.commodityTypeId);
        });

        var userCommodityTypes = _.filter(models._AllCommodityTypes, function (d) {
            return userCommodityTypeIds.indexOf(d.id) > -1;
        });
        models.UserCommodityTypes = userCommodityTypes;

        models.ContextCommodities = models.ListCommodities({
            forContext: true
        });
        models.WithoutDisabledUserContextCommodities = models.ListCommodities({
            forUser: true,
            forContext: true
        });
        models.UserContextCommodities = models.ListCommodities({
            disabled: null,
            forUser: true,
            forContext: true
        });
        var userContextCommodityTypeIds = $.map(models.UserContextCommodities, function (r) {
            return r.commodityTypeId;
        });
        models.UserContextCommodityTypes = $.grep(models.AllCommodityTypes, function (r) {
            return $.inArray(r.id, userContextCommodityTypeIds) !== -1;
        });
        models.UserBusinessDepartments = $.grep(models.AllBusinessDepartments, function (r) {
            return r.forUser;
        });
        models.UserContextBusinessDepartments = $.grep(models.UserBusinessDepartments, function (r1) {
            var deptIds = $.map(models.UserContextBusinesses, function (r2) {
                return r2.departmentId;
            });
            return $.inArray(r1.id, deptIds) !== -1;
        });
        models.AllContractTypes = $.map(models.EnumOptions.ContractTypeUIDetail || [], function (r) {
            return {
                name: r.text, id: r.value
            };
        });
        models.UserDepartments = models.UserBusinessDepartments;
        models.UserContextDepartments = models.UserContextBusinessDepartments;
        $.each(models.AllDepartments, function (i, r1) {
            r1.businesses = $.grep(models.AllBusinesses, function (r2) {
                return r2.departmentId === r1.id;
            });
            r1.allAccountingEntities = $.grep(models.AllAccountingEntities, function (r2) {
                return $.inArray(r2.id, r1.accountEntityIds) !== -1;
            });
            r1.allAccountEntities = r1.allAccountingEntities;
            r1.accountingEntities = r1.allAccountingEntities;
            r1.accountEntities = r1.allAccountingEntities;
            r1.allBusinessDepartments = $.grep(models.AllBusinessDepartments, function (r2) {
                return $.inArray(r2.id, r1.businessDepartmentIds) !== -1;
            });
            r1.businessDepartments = $.grep(r1.allBusinessDepartments, function (r2) {
                return r2.forUser;
            });
            r1.allCommodities = models.ListCommodities({
                forUser: false,
                forContext: false,
                departmentId: r1.id
            });
            r1.commodities = models.ListCommodities({
                forUser: true,
                forContext: true,
                departmentId: r1.id
            });
            r1.allSalers = models.ListSalers({
                forUser: false,
                forContext: false,
                departmentId: r1.id,
                disabled: null
            });
            r1.userContextSalers = models.ListSalers({
                forUser: true,
                forContext: true,
                departmentId: r1.id,
                disabled: null
            });
            r1.userContextEnabledSalers = models.ListSalers({
                forUser: true,
                forContext: true,
                departmentId: r1.id,
                disabled: false
            });
            r1.salers = r1.userContextEnabledSalers;
        });
        $.each(models._AllCorporations, function (i, r1) {
            r1.businesses = $.grep(models.AllBusinesses, function (r2) {
                return r2.corporationId === r1.id;
            });
        });
        $.each(models.AllUnits, function (i, r) {
            r.code = r.informalSymbol;
        });
        models.AllMaterials = [];
        $.each(models.AllCommodities, function (i, r1) {
            $.each(r1.brands, function (i2, r2) {
                r2.name = r2.brand + (r2.origin ? ', 原产地:' + r2.origin : '');
            });
            _.each(r1.specifications, function (r2) {
                r2.commodityId = r1.id;
                models.AllMaterials.push(r2);
            });
            r1.businesses = $.grep(models.AllBusinesses, function (r2) {
                return r2.commodityId === r1.id;
            });
            r1.allBusinessDepartments = models.ListDepartments({
                forBusiness: true,
                forBusinessDepartment: true,
                forAccounting: false,
                forUser: false,
                forContext: false,
                commodityId: r1.id
            });
            r1.businessDepartments = models.ListDepartments({
                forBusiness: true,
                forBusinessDepartment: true,
                forAccounting: false,
                forUser: true,
                forContext: true,
                commodityId: r1.id
            });
            r1.allAccountingEntityIds = $.map($.map(r1.allBusinessDepartments, function (r2) {
                return r2.allAccountingEntities || [];
            }), function (r2) {
                return r2.id;
            });
            r1.accountingEntityIds = $.map($.map(r1.businessDepartments, function (r2) {
                return r2.accountingEntities || [];
            }), function (r2) {
                return r2.id;
            });
            r1.accountEntityIds = r1.accountingEntityIds;
            r1.allAccountingEntities = $.grep(models.AllAccountingEntities, function (r2) {
                return $.inArray(r2.id, r1.allAccountEntitingyIds || []) !== -1;
            });
            r1.allAccountEntities = r1.allAccountingEntities;
            r1.accountingEntities = $.grep(models.AllAccountingEntities, function (r2) {
                return $.inArray(r2.id, r1.accountingEntityIds || []) !== -1;
            });
            r1.accountEntities = r1.accountingEntities;
            r1.allSalerIds = $.map($.map(r1.allBusinessDepartments, function (r2) {
                return r2.allSalers || [];
            }), function (r2) {
                return r2.id;
            });
            r1.userContextSalerIds = $.map($.map(r1.businessDepartments, function (r2) {
                return r2.userContextSalers || [];
            }), function (r2) {
                return r2.id;
            });
            r1.userContextEnabledSalerIds = $.map($.map(r1.businessDepartments, function (r2) {
                return r2.userContextEnabledSalers || [];
            }), function (r2) {
                return r2.id;
            });
            r1.allSalers = $.grep(models.AllSalers, function (r2) {
                return $.inArray(r2.id, r1.allSalerIds || []) !== -1;
            });
            r1.userContextSalers = $.grep(models.AllSalers, function (r2) {
                return $.inArray(r2.id, r1.userContextSalerIds || []) !== -1;
            });
            r1.userContextEnabledSalers = $.grep(models.AllSalers, function (r2) {
                return $.inArray(r2.id, r1.userContextEnabledSalerIds || []) !== -1;
            });
            r1.salers = r1.userContextEnabledSalers;
            r1.mainQuantityUnitIds = $.map($.grep(models.AllCommodityMainQuantityUnits, function (r2) {
                return r2.commodityId === r1.id;
            }), function (r2) {
                return r2.mainQuantityUnitId;
            });
            r1.mainQuantityUnits = $.grep(models.AllUnits, function (r2) {
                return $.inArray(r2.id, r1.mainQuantityUnitIds) !== -1;
            });
        });
        models.UserAccountingEntityIds = $.map($.map(models.UserBusinessDepartments, function (r) {
            return r.accountingEntities || [];
        }), function (r) {
            return r.id;
        });
        models.UserContextAccountingEntityIds = $.map($.map(models.UserContextBusinessDepartments, function (r) {
            return r.accountingEntities || [];
        }), function (r) {
            return r.id;
        });
        models.UserCorporations = _.uniqBy(_.map(models.UserContexts, function (d) {
            return { name: d.Corporation, id: d.CorporationId};
        }), 'id');
        models.UserAccountingEntities = $.grep(models.AllAccountingEntities || [], function (r) {
            return $.inArray(r.id, models.UserAccountingEntityIds || []) !== -1;
        });
        models.UserContextAccountingEntities = $.grep(models.AllAccountingEntities || [], function (r) {
            return $.inArray(r.id, models.UserContextAccountingEntityIds || []) !== -1;
        });
        models.AccountingEntities = models.UserContextAccountingEntities;
        models.CurrContextTradeTypeOptions = $.grep(models.EnumOptions.TradeType, function (r) {
            return (r.value & window.GMK.Context.TradeType) === r.value;
        });
        //models.CurrContext.TradeTypeOptions = $.grep(models.EnumOptions.TradeType, function (r) {
        //    return (r.value & models.CurrContext.TradeType) === r.value;
        //});
        var isDomestic = window.GMK.Context.IsDomesticTradeType;
        if (isDomestic === true) {
            models.AllCurrencies.sort(function (a, b) {
                return a.domesticIndex - b.domesticIndex;
            });
        } else if (isDomestic === false) {
            models.AllCurrencies.sort(function (a, b) {
                return a.foreignIndex - b.foreignIndex;
            });
        }
        _.each(models.AllInstrumentCategories, function (r) {
            r.market = _.find(models._AllCompanies, function (r2) {
                return r2.id === r.marketId;
            });
            r.commodityType = _.find(models.AllCommodityTypes, function (r2) {
                return r2.id === r.commodityTypeId;
            });
            r.currency = _.find(models.AllCurrencies, function (r2) {
                return r2.id === r.currencyId;
            });
            r.unit = _.find(models.AllUnits, function (r2) {
                return r2.id === r.unitId;
            });
            r.text = (r.code || ' ') + ' - ' + ((r.market || {}).name || ' ');
        });

        //EnumRelations 相关操作方法
        var enumRelationFuns = {
            getAvailablePayPurposeTypes: function (tradeType, direction) {
                var types = $.map($.grep(models.EnumRelations.Amount, function (r) {
                    return (r.TradeType & tradeType) && (r.Direction & direction);
                }), function (r) {
                    return r.PayPurposeType;
                });
                return types.getUnique();
            },
            getAmountDetailObjectTypes: function (payPurposeType, tradeType, direction) {
                return $.map($.grep(models.EnumRelations.Amount, function (r) {
                    return r.PayPurposeType === payPurposeType && (r.TradeType & tradeType) && (r.Direction & direction);
                }), function (r) {
                    return r.AmountDetailObjectType;
                });
            },
            getPaymentFormTypes: function (exchangeProcessType) {
                return $.map($.grep(models.EnumRelations.ExchangeProcessPaymentForm, function (r) {
                    return r.ExchangeProcessType === exchangeProcessType;
                }), function (r) {
                    return r.PaymentFormType;
                });
            },
            getPaymentFormTypeOptions: function (exchangeProcessType) {
                var paymentFormTypes = models.EnumRelations.getPaymentFormTypes(exchangeProcessType);
                return $.grep(models.EnumOptions.PaymentFormType, function (r) {
                    return $.inArray(r.value, paymentFormTypes) !== -1;
                });
            },
            getStorageEntryDetailTypes: function (spotReceiveType, tradeType) {
                return $.map($.grep(models.EnumRelations.WarehouseStorageEntry, function (r) {
                    return r.SpotReceiveType === spotReceiveType && (r.TradeType & tradeType);
                }), function (r) {
                    return r.SendReceiveObjectType;
                });
            },
            getStorageOutDetailTypes: function (spotSendType, tradeType) {
                return $.map($.grep(models.EnumRelations.WarehouseStorageOut, function (r) {
                    return r.SpotSendType === spotSendType && (r.TradeType & tradeType);
                }), function (r) {
                    return r.SendReceiveObjectType;
                });
            },
        };
        models.EnumRelations = $.extend(models.EnumRelations, enumRelationFuns);

        self = $.extend(self, models, ex);
        $.each(models.AllCurrencyPairs, function (i, r) {
            r.baseCurrency = self.findById(models.AllCurrencies, r.baseCurrencyId);
            r.counterCurrency = self.findById(models.AllCurrencies, r.counterCurrencyId);
            r.baseCurrencyName = self.findCurrency(r.baseCurrencyId);
            r.counterCurrencyName = self.findCurrency(r.counterCurrencyId);
            r.name = r.baseCurrencyName + '兑' + r.counterCurrencyName;
        });
        self.roundCommodityWeight = self.roundCargoWeight;
        self.formatCommodityWeight = self.formatCargoWeight;
        self.findUnit = self.findUnitInformalName;
        self.findUnitCode = self.findUnitInformalSymbol;
        //self.UserPermissionNames = $.map(self.UserPermissions || [], function (val, i) {
        //    return val.name;
        //});
        //self.hasPermission = function (permissionName) {
        //    return $.inArray($.trim(permissionName), self.UserPermissionNames) !== -1;
        //};
        //self.shanghaiFutureExchange = (utils.find(self._AllExchanges, function (r) {
        //    return r.name === '上海期货交易所';
        //}) || {});
        self.bohaiExchange = (utils.find(self._AllExchanges, function (r) {
            return r.name === '天津渤海商品交易所';
        }) || {});
        self.wuxiExchange = (utils.find(self._AllExchanges, function (r) {
            return r.name === '无锡市不锈钢电子交易中心有限公司';
        }) || {});
        //self.shangjinExchange = (utils.find(self._AllExchanges, function (r) {
        //    return r.name === '上海黄金交易所';
        //}) || {});
        self.foreignExchangeIds = $.map($.grep(self._AllExchanges, function (r) {
            return r.name === "伦敦金属交易所";
        }), function (r) {
            return r.id;
        });
        self.bwExchangeIds = [self.bohaiExchange.id, self.wuxiExchange.id];
        //self.isShanghaiFutureExchange = function (id) {
        //    return id && id === self.shanghaiFutureExchange.id;
        //};
        //self.isShangjinExchange = function (id) {
        //    return id && id === self.shangjinExchange.id;
        //};
        self.isBohaiExchange = function (id) {
            return id && id === self.bohaiExchange.id;
        };
        self.isWuxiExchange = function (id) {
            return id && id === self.wuxiExchange.id;
        };
        self.isSpecialReceiptExchange = function (id) {
            return $.inArray(id, self.bwExchangeIds) !== -1;
        };
        self.isForeignExchange = function (id) {
            //return $.inArray(id, self.foreignExchangeIds) !== -1;
            var exchange = _.find(self._AllExchanges, ['id', id]);
            var isForeign = !exchange ? false : (_.find(exchange.typeConfs, 'isCqg') ? true : false);
            return isForeign;
        };
        //self.hasFixingPrice = function (marketId, commodityTypeId) {
        //    return self.findCompany(marketId) === '上海华通铂银交易市场有限公司' && self.findCommodityType(commodityTypeId) === '白银';
        //};
        //self.hasQuoteSpec = function (marketId, commodityTypeId) {
        //    return self.findCompany(marketId) === '上海华通铂银交易市场有限公司' && self.findCommodityType(commodityTypeId) === '白银';
        //};

        self.forLcBillTypes = [models.Enums.ExchangeBillType.LetterOfCreditsBankDemandDraft, models.Enums.ExchangeBillType.LetterOfCreditsBankAcceptanceBill];
        self.notSightBillTypes = [models.Enums.ExchangeBillType.BankAcceptanceBill, models.Enums.ExchangeBillType.CommercialAcceptanceBill, models.Enums.ExchangeBillType.LetterOfCreditsBankAcceptanceBill];
        self.sightAndAcceptanceBillTypes = [models.Enums.ExchangeBillType.BankAcceptanceBill, models.Enums.ExchangeBillType.CommercialAcceptanceBill, models.Enums.ExchangeBillType.LetterOfCreditsBankAcceptanceBill,
        models.Enums.ExchangeBillType.BankDemandDraft, models.Enums.ExchangeBillType.CommercialDraftAtSight, models.Enums.ExchangeBillType.LetterOfCreditsBankDemandDraft];

        self.isForLcBillType = function (billType) {
            return $.inArray(billType, self.forLcBillTypes) !== -1;
        };
        self.isNotSightBillType = function (billType) {
            return $.inArray(billType, self.notSightBillTypes) !== -1;
        };
        self.isSightAndAcceptanceBillTypes = function (billType) {
            return $.inArray(billType, self.sightAndAcceptanceBillTypes) !== -1;
        };
        // fetch query from cookie if existing and fill in the searchForm
        self.getQuery = function () {
            var query = Cookies.get('query');
            return query ? JSON.parse(query) : query;
        }
        self.registerStateChange = function (callback) {
            History.Adapter.bind(window, 'statechange', function () {
                if (utils.isStateChangeSuppressed()) {
                    utils.responseStateChange();
                    return;
                }
                callback(History.getState().data);
            });
        };
        //var state = History.getState();
        //var query = self.getQuery();
        //if (query) History.replaceState(query, state.title, state.url);
        self.registerQueryFormEvent = function () {
            var queryFormSelector = queryFormSelector || ".query-form-expanded";
            var $queryForms = $(queryFormSelector);

            //由于row-fluid在bootstrap3中被弃用 故需要移除 并替换成row
            if ($queryForms.hasClass("row-fluid")) {
                $queryForms.addClass("row").removeClass("row-fluid").css({
                    'marginLeft': '0',
                    'marginRight': '0'
                });
            }
            if ($queryForms.length) {
                _.forEach($queryForms, function (d) {
                    var $queryForm = $(d);
                    var $formGroup = $queryForm.find(".form-group");
                    var $btnContainer = $queryForm.siblings(".btn-container");
                    var $queryFormCollapse = $btnContainer.find(".query-form-collapse");
                    if (!$queryFormCollapse.length) {
                        var queryFormCollapseSelector = '<i class="fa fa-angle-double-up query-form-collapse" title="' + utils.t("featureBase.expandOrNot") + '"></i>';
                        $queryFormCollapse = $(queryFormCollapseSelector);
                        $btnContainer.append($queryFormCollapse);
                    }
                    $queryFormCollapse.on("mouseover", function (event) {
                        $(this).css("opacity", 1);
                    });
                    $queryFormCollapse.on("mouseleave", function (event) {
                        $(this).css("opacity", 0.3);
                    });
                    $queryFormCollapse.on("click", function (event) {
                        var isHide = $queryForm.hasClass("hide");

                        if (isHide) {
                            $queryForm.removeClass("hide");
                            $(this).removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
                        } else {
                            $queryForm.addClass("hide");
                            $(this).removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                        }
                    });

                    //用户偏好设置按钮
                    var $queryFormOption = $btnContainer.find(".query-form-option");

                    if (!$queryFormOption.length) {
                        var queryFormOptionSelector = '<i class="fa fa-cog query-form-option" title="' + utils.t("featureBase.customSearch") + '"></i>';
                        $queryFormOption = $(queryFormOptionSelector);
                        $btnContainer.append($queryFormOption);
                    }
                    $queryFormOption.on("mouseover", function (event) {
                        $(this).css("opacity", 1);
                    });
                    $queryFormOption.on("mouseleave", function (event) {
                        $(this).css("opacity", 0.3);
                    });

                    //处理input

                    var $formInputGroup = $formGroup.find("input.form-control");
                    //默认将placeholder设置到 input上去
                    _.forEach($formInputGroup, function (d) {
                        var $item = $(d);
                        var placeHolder = $item.attr("placeholder");
                        var title = $item.attr("title");
                        if (!title) {
                            if (placeHolder) {
                                $item.attr("title", placeHolder);
                            }
                        }
                    });

                    //处理 select2 & select
                    var $formSelect2Group = $formGroup.find("select.form-control");

                    _.forEach($formSelect2Group, function (d) {
                        var $item = $(d);
                        var title = $item.attr("title");
                        //如果没有初始设置title
                        if (!title) {
                            var bind = $item.data("bind");
                            if (bind) {
                                var splitBinds = bind.split("optionsCaption");
                                var hasOptionsCaption = splitBinds.length === 2;
                                if (hasOptionsCaption) {
                                    var placeHolderStr = splitBinds[1].trim().split("'");
                                    if (placeHolderStr.length >= 3) {
                                        var placeHolder = placeHolderStr[1];
                                        $item.attr("title", placeHolder);
                                    }
                                    //var placeHolder = $item.find("option").get(0).innerText;
                                }
                            }
                        }
                    });
                    var showQueryList = [];
                    var hideQueryList = [];
                    var editShowQueryList = [];
                    var editHideQueryList = [];
                    function getStorageKey() {
                        var location = window.location;
                        var host = location.host;

                        var hash = location.hash;
                        var shortHash = hash.split("#")[1].split("?")[0] + GMK.Context.UserName + "_Query";
                        return host + shortHash;
                    }

                    function getQueryConfig() {
                        //-1.获取当前页面的偏好key
                        var storageKey = getStorageKey();
                        //0.get 用户偏好配置。
                        var userCustomQuery = JSON.parse(localStorage.getItem(storageKey)) || [];
                        var hasCustomQuery = userCustomQuery.length > 0;
                        //1.找到所有的 form-group 下的input select的title作为查询条件的label
                        _.forEach($formGroup, function (d, i) {
                            //找到每个group下的input or select的title
                            var title = "";
                            var index = i;
                            var $group = $(d);
                            var $input = $group.find("input");
                            _.forEach($input, function (r) {
                                var $item = $(r);
                                var iTitle = $item.attr("title") || "";
                                title += iTitle;
                            });
                            var $select = $group.find("select");
                            _.forEach($select, function (r) {
                                var $item = $(r);
                                var iTitle = $item.attr("title") || "";
                                title += iTitle;
                            });
                            //暂时不考虑isHidden;
                            var isHidden = $group.is(":hidden");
                            var disabled = $group.is(":hidden") ? "disabled" : "";
                            var item = { index: index, text: title };
                            //如果用户还未配置偏好
                            var config = _.find(userCustomQuery, function (r) {
                                return r.index === index;
                            });
                            //隐藏的不做偏好配置
                            if (!hasCustomQuery || config) {
                                showQueryList.push(item);
                            } else {
                                hideQueryList.push(item);
                            }
                        });
                    }

                    function showOrHideQuery() {
                        _.forEach($formGroup, function (d, idx) {
                            var isHide = _.filter(hideQueryList, function (r) {
                                return +r.index === idx;
                            }).length > 0;
                            if (isHide) {
                                $(d).css("display", "none");
                            } else {
                                $(d).css("display", "block");
                            }
                        });
                    };

                    function reRenderOptions($select, list) {
                        var options = "";
                        if (list) {
                            $.each(list, function (i, d) {
                                if (!!$.trim(d.text)) {
                                    options += '<option value=' + d.index + '>' + d.text + '</option>';
                                }
                            });
                        }
                        $select.html(options);
                    };

                    getQueryConfig();
                    showOrHideQuery();
                    $queryFormOption.on("click", function (event) {
                        editShowQueryList = JSON.parse(JSON.stringify(showQueryList));
                        editHideQueryList = JSON.parse(JSON.stringify(hideQueryList));
                        var $modal = $("#ManageQueryModal");
                        var $leftBtn = $modal.find(".buttons .left-btn");
                        var $rightBtn = $modal.find(".buttons .right-btn");
                        var $availableSelect = $modal.find("#display-available-list");

                        $availableSelect.on("change", function (event) {
                            var value = $(this).val();
                            if (value) {
                                $rightBtn.removeAttr("disabled");
                            }
                        });

                        var $selectedSelect = $modal.find("#display-selected-list");
                        $selectedSelect.on("change", function (event) {
                            var value = $(this).val();
                            if (value) {
                                $leftBtn.removeAttr("disabled");
                            }
                        });

                        reRenderOptions($availableSelect, editHideQueryList);
                        reRenderOptions($selectedSelect, editShowQueryList);

                        $leftBtn.unbind("click").bind("click", function (event) {
                            var changedValue = $selectedSelect.val();

                            var remainShows = _.filter(editShowQueryList, function (d) {
                                return changedValue.indexOf(d.index.toString()) === -1;
                            });
                            var hideCols = _.filter(editShowQueryList, function (d) {
                                return changedValue.indexOf(d.index.toString()) > -1;
                            });
                            editShowQueryList = remainShows;
                            editHideQueryList = editHideQueryList.concat(hideCols);
                            reRenderOptions($availableSelect, editHideQueryList);
                            reRenderOptions($selectedSelect, editShowQueryList);
                            $(this).attr("disabled", true);
                        });

                        $rightBtn.unbind("click").bind("click", function (event) {
                            var changedValue = $availableSelect.val();
                            var remainHides = _.filter(editHideQueryList, function (d) {
                                return changedValue.indexOf(d.index.toString()) === -1;
                            });
                            var showCols = _.filter(editHideQueryList, function (d) {
                                return changedValue.indexOf(d.index.toString()) > -1;
                            });
                            editHideQueryList = remainHides;
                            editShowQueryList = editShowQueryList.concat(showCols);
                            reRenderOptions($availableSelect, editHideQueryList);
                            reRenderOptions($selectedSelect, editShowQueryList);
                            $(this).attr("disabled", true);
                        });

                        var manageBtn = $modal.find(".manage-btn");
                        manageBtn.on("click", function (event) {
                            showQueryList = editShowQueryList;
                            hideQueryList = editHideQueryList;
                            var key = getStorageKey();
                            localStorage.setItem(key, JSON.stringify(showQueryList));
                            showOrHideQuery();
                        });

                        $modal.modal("show");
                    });
                });
            }
        };
        callback(self);
        commonModels = self;
    };
    $.ajaxSetup({
        cache: false
    });
};
var host = window.location.host;
var commonModels = null;

GMK.Features.CommonModels.onReady = function (callback) {
    var base = GMK.Features.FeatureBase;
    var path = "SystemConfig/CommonModelVersion";
    var url = window.GMK.Context.RootUrl + path;
    var commonModelVersion = sessionStorage.getItem("cmv");
    $.getJSON(url, null, function (result) {
        var newVersion = result.Data;
        //如果缓存版本跟服务器版本不一致
        if (newVersion !== commonModelVersion) {
            sessionStorage.setItem("cmv", newVersion);
            new GMK.Features.CommonModels(callback, false);
        } else {
            //如果缓存了CommonModels
            if (sessionStorage.getItem(host + "ccm")) {
                //如果全局变量已经保存处理后的commonModels，直接callback 否则 需要从session中获取然后处理commonmodels
                if (commonModels) {
                    callback(commonModels);
                } else {
                    new GMK.Features.CommonModels(callback, true);
                }
                //如果没有缓存，则从服务器获取后缓存
            } else {
                new GMK.Features.CommonModels(callback, false);
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        utils.alert(utils.t("featureBase.errorMsg").format(jqXHR.status));
    });
};

GMK.Features.CommonListViewModel = function (paramOptions) {
    var defaultOptions = {
        toqueryMappingFromJS: ko.mapping.fromJS,
        toqueryMappingToJS: ko.mapping.toJS,
        setUrl: function (params) {
            var urlParams = utils.getCleanedEmpty(params);
            var url = location.origin + location.pathname + location.hash.split('?')[0] + '?' + $.param(urlParams, true);
            history.replaceState(null, null, url);
        },
        getPageSummary: function (items) {
            return {
            };
        },
        getList: function (result) {
            return result.Data.list || [];
        },
        getPagination: function (result) {
            return result.Data.pagination || {
                PageSize: 15,
                CurrentPage: 1
            };
        },
        getSummary: function (result) {
            return result.Data.summary || {
            };
        },
        mapItem: function (r) {
            return r;
        },
        callInitializeCallback: function (callback) {
            if (callback) {
                callback();
            }
        },
        afterSearch: function (result) {
        },
        enablePager: true,
        pagerElem: '#pager',
        route: {
            values: {
                query: {
                    Pagination: {
                        PageSize: 15,
                        CurrentPage: 1
                    }
                }
            }
        },
        viewModelRootPath: '$root',
        enableRowExpand: false,
        rowExpandProp: '_expanded',
        beforeRowExpand: null,
    };
    var options = $.extend(true, {}, defaultOptions, paramOptions);
    var route = options.route;
    route.values = route.values || $.extend(true, {}, defaultOptions.route.values);
    var self = this;
    self.values = route && route.values;
    var defaultQuery = options.defaultQuery || self.values && self.values.query || {};
    defaultQuery.Pagination = defaultQuery.Pagination || defaultOptions.route.values.query.Pagination;
    defaultQuery.Pagination.PageSize = defaultQuery.Pagination.PageSize || defaultOptions.route.values.query.Pagination.PageSize;
    defaultQuery.Pagination.CurrentPage = defaultQuery.Pagination.CurrentPage || defaultOptions.route.values.query.Pagination.CurrentPage;
    var base = GMK.Features.FeatureBase;
    self.mapItem = options.enableRowExpand ? function (r) {
        var row = options.mapItem(r);
        row[options.rowExpandProp] = ko.observable(false);
        return row;
    } : options.mapItem;
    self.items = ko.observableArray();
    self.initialized = ko.observable(false);
    self.loaded = ko.observable(false);
    self.toquery = ko.mapping.fromJS({});
    options.toqueryMappingFromJS(defaultQuery, self.toquery);
    self.queried = ko.observable({
    });
    self.setUrl = options.setUrl || function () {
    };
    self.resultPagination = ko.observable({
    });
    self.resultSummary = ko.observable({
    });
    self.pageSummary = ko.computed(function () {
        return options.getPageSummary(self.items());
    });
    self.search = function (params, callback) {
        base._get(options.searchUrl.replace(/\??$/, '?') + $.param(utils.getCleanedEmpty(params), true), {}, function (result) {
            self.queried(params);
            options.toqueryMappingFromJS(params, self.toquery);
            self.setUrl(params);
            self.fill(result);
            self.loaded(true);
            if (callback) {
                callback();
            }
            options.afterSearch(result);
        });
    };
    self.fill = function (result) {
        var list = $.map(options.getList(result), self.mapItem);
        self.items(list);
        self.resultSummary(options.getSummary(result));
        if (options.enablePager) {
            self.resultPagination(options.getPagination(result));
            base._pagination({
                $elem: $(options.pagerElem),
                pageCount: +self.resultPagination().PageCount,
                itemCount: +self.resultPagination().TotalCount,
                pageSize: +self.resultPagination().PageSize,
                currentPage: +self.resultPagination().CurrentPage,
                changePage: self.changePage
            });
        }
    };
    self.changePage = function (newPage, pageSize, callback) {
        var params = self.queried();
        var currPageSize = +self.toquery.Pagination.PageSize();
        var newPageSize = +pageSize || +params.Pagination.PageSize;
        params.Pagination.PageSize = newPageSize;
        self.toquery.Pagination.PageSize(newPageSize);
        params.Pagination.CurrentPage = newPageSize === currPageSize ? +newPage || +params.Pagination.CurrentPage : 1;
        self.search(params, callback);
    };
    self.onSearch = function () {
        if (self.toquery.Pagination && self.toquery.Pagination.CurrentPage) {
            self.toquery.Pagination.CurrentPage(1);
        }
        var params = options.toqueryMappingToJS(self.toquery);
        self.search(params);
    };
    self.initialize = function (callback) {
        options.callInitializeCallback(callback);
        var params = options.toqueryMappingToJS(self.toquery);
        self.search(params);
        self.initialized(true);
    };

    self.reload = function (callback) {
        var params = self.queried();
        self.search(params, options.enablePager ? function () {
            var currPage = Math.max(1, +self.resultPagination().CurrentPage);
            var pageCnt = Math.max(1, +self.resultPagination().PageCount);
            if (currPage > pageCnt) {
                self.changePage(pageCnt, +self.resultPagination().PageSize, callback);
            } else {
                if (callback) {
                    callback();
                }
            }
        } : callback);
    };
    self.onDelete = function (item) {
        base._delete(options.deleteUrl, options.getDeleteParam(item), function () {
            self.reload();
        });
    };
    if (options.enableRowExpand) {
        self.expandRow = function (row, expand) {
            if (options.beforeRowExpand) {
                options.beforeRowExpand(row, expand);
            }
            row[options.rowExpandProp](expand);
        };
        self.onExpandAllRows = function (expand) {
            return function () {
                _.each(self.items(), function (r) {
                    if (r[options.rowExpandProp]() !== expand) {
                        self.expandRow(r, expand);
                    }
                });
            };
        };
        self.getOnExpandRow = function (row) {
            return function () {
                self.expandRow(row, !row[options.rowExpandProp]());
            };
        };
        ko.components.register('expand-row-header', {
            viewModel: function (params) {
                this.css = $.extend({ 'expand-row-header-col-header': true }, (params || {}).css);
                this.style = $.extend({}, (params || {}).style);
            },
            template: '<th class="unfold-all"  title="' + utils.t("featureBase.collapseAll") + '" data-bind="click: $root.onExpandAllRows(false), css: css, style: style">\
                    <i class="fa fa-angle-double-up" style="font-size: 20px;"></i>\
                </th>'
        });
        ko.components.register('expand-row', {
            viewModel: function (params) {
                this.css = $.extend({ 'expand-row-col-header': true }, (params || {}).css);
                this.style = $.extend({}, (params || {}).style);
            },
            template: '<td style="position: relative; text-align: center; vertical-align: top;" data-bind="click: $root.getOnExpandRow($parent), attr: { rowspan: $parent.' + options.rowExpandProp + '() ? 2 : 1 }, css: css, style: style">\
                    <span class="fa fa-plus" aria-hidden="true" data-bind="visible: !$parent.' + options.rowExpandProp + '()"></span>\
                    <span class="fa fa-minus" aria-hidden="true" data-bind="visible: $parent.' + options.rowExpandProp + '()"></span>\
                    <div data-bind="visible: $parent.' + options.rowExpandProp + '()" style="height: 54px;margin-top: 14px;background-color: rgb(170, 170, 170);width: 1px;position: absolute;left: 50%;top: 0px;display: block;"></div>\
                    <div data-bind="visible: $parent.' + options.rowExpandProp + '()" style="width:1px;background-color:#aaa;height:100%;"></div>\
                    <div data-bind="visible: $parent.' + options.rowExpandProp + '()" style="position:absolute;top:68px;left: 50%;width:6px;height:1px;background-color:#aaa;"></div>\
                </td>'
        });
    }
};
//# sourceURL=http://tb/Scripts/app/FeatureBase.js
