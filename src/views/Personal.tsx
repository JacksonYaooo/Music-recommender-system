import { PropType, defineComponent } from "vue";
import s from "./Personal.module.scss";

export const Personal = defineComponent({
 props: {
   name: {
    type: String as PropType<string>
   }
 },
 setup(props, context) {
   return () => (
      <div>personal</div>
    );
  }
})