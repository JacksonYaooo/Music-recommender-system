import { PropType, defineComponent, ref } from 'vue';
export type IconType = 'icon-geren' | 'icon-shouye' | 'icon-a-erjitinggegequshouting' | 'icon-aixin' | 'icon-shishishujuzhanshi'
import s from './Icon.module.scss'
export const Icon = defineComponent({
  props: {
    name: {
      type: String as PropType<IconType>,
      default: '',
      required: true
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.icon}><i class={`iconfont ${props.name}`}></i></div>
    )
  }
})