import { PropType, defineComponent, ref } from 'vue';
import {
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
export type IconType = 'Document' | 'IconMenu' | 'Location' | 'Setting'
export const Icon = defineComponent({
  props: {
    name: {
      type: String as PropType<IconType>,
      default: '',
      required: true
    }
  },
  setup: (props, context) => {
    const showIcon = () => {
      switch (props.name) {
        case 'Document':
          return <Document />
        case 'IconMenu':
          return <IconMenu />
        case 'Setting':
          return <Setting />
        default:
          break;
      }
    }

    return () => (
      <div>{showIcon()}</div>
    )
  }
})