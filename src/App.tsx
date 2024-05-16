import { PropType, defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from './App.module.scss'
import { Menu } from "./views/Menu";
import { Login } from "./views/Login";

interface LoginInfo {
  username: string | null
}
export const App = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    return () => (
      <div class={s.wrapper}>
        <div class={s.left}>
          <Menu />
        </div>
        <div class={s.right}><RouterView /></div>
      </div>
    );
  }
})