import { PropType, defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from './App.module.scss'

export const App = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    return () => (
      <div class={s.wrapper}>
        <div>xxx</div>
        <div><RouterView /></div>
      </div>
    );
  }
})