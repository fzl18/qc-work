import _ from 'lodash'
import fileUpload from './file-upload'
import qcgrid from './qcgrid/QcGrid'
import FormatCell from './FormatCell'
import InstrumentSelect from './InstrumentSelect'
import QcPage from './Page.vue';
import FormItem from './Form/form-item';
import Table from './table/index';
import qcCollapse from './qc-collapse.vue';
import Input from './Input.vue';

const components = {
    fileUpload,
    qcgrid,
    FormatCell,
    InstrumentSelect,
    QcPage,
    FormItem,
    Table,
    qcCollapse,
    Input
}

const CustomComponents = {
    install: function(Vue) {
        _.forEach(components, (value, key) => {
            Vue.component(key, value)
        })
    }
}

export default CustomComponents
