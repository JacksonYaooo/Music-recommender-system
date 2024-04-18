import { defineComponent } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'

export const Home = defineComponent({
  setup(props, context) {
    return () => (
      <div>
        Home
      </div>
    );
  }
})