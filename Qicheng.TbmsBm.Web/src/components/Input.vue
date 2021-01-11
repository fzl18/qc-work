<script>
import {Input} from 'view-design'
export default {
  extends: Input,
  computed: {
    currentType () {
      let type = this.type;
      if (type === 'password' && this.password && this.showPassword) type = 'text';
      if (type === 'number') type = 'text';
      return type;
    },
  },
  mounted() {
    if(this.currentValue == null) {
      this.$emit('input', '');
      this.currentValue = ''
    }
  },
  methods: {
    handleInput (event) {
      if (this.isOnComposition) return;
      let value = event.target.value;
      if(this.type == 'number') {
        if(value.endsWith('.')) {
          return
        }
        if(isNaN(Number(value)) && value == '-' && event.inputType == 'deleteContentBackward') {
          return
        }
        if(isNaN(Number(value)) && value !== '-' && event.inputType !== 'deleteContentBackward') {
          event.target.value = this.currentValue
          return
        }
      }
      if (this.number && value !== '') value = Number.isNaN(Number(value))  ? value : Number(value);
      if (this.type == 'number' && value !== '') value = Number.isNaN(Number(value)) ? value : Number(value);
      if(this.type == 'number' && value == '-') {
        this.$emit('input', '');
        this.setCurrentValue('');
        this.$emit('on-change', event);
        return
      }
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('on-change', event);
    }
  }
}
</script>