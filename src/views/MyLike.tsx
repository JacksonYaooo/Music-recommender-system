import { PropType, defineComponent } from "vue";
import s from "./MyLike.module.scss";

export const MyLike = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    return () => (
      <div>MyLike</div>
    );
  }
})