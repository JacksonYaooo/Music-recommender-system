import { PropType, defineComponent } from "vue";
import s from "./Data.module.scss";

export const Data = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    return () => (
      <div>Data</div>
    );
  }
})