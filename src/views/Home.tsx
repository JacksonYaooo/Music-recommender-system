import { PropType, defineComponent } from "vue";
import s from "./Home.module.scss";

export const Home = defineComponent({
 setup(props, context) {
   return () => (
      <div>Home</div>
    );
  }
})