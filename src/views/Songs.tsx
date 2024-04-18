import { PropType, defineComponent } from "vue";
import s from "./Songs.module.scss";

export const Songs = defineComponent({
 props: {
   name: {
    type: String as PropType<string>
   }
 },
 setup(props, context) {
   return () => (
      <div>Songs</div>
    );
  }
})