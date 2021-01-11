import _ from 'lodash';
import fileUpload from './file-upload';
import qcgrid from './qcgrid/QcGrid';
import Locales from './Locales';
import FormatCell from './FormatCell';
import InstrumentSelect from './InstrumentSelect';
import Table from './table/index';
import QcPage from './Page.vue';
import FormItem from './Form/form-item.vue';
import Input from './Input.vue';
import qcCollapse from './qc-collapse.vue';

const components = {
  fileUpload,
  qcgrid,
  Locales,
  InstrumentSelect,
  Table,
  FormatCell,
  QcPage,
  FormItem,
  qcCollapse,
  Input
};

const CustomComponents = {
  install: function (Vue) {
    _.forEach(components, (value, key) => {
      Vue.component(key, value);
    });
  }
};

export default CustomComponents;
