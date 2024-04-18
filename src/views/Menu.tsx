import { PropType, defineComponent } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'
import { Icon } from "../shared/Icon";
import { IconType } from '../shared/Icon'

interface IMenu {
  title: string;
  icon: IconType;
}

export const Menu = defineComponent({
  setup: (props, context) => {
    const isCollapse = ref(false)
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const MenuMap: IMenu[] = [
      { title: 'Home', icon: 'IconMenu' },
      { title: 'Data', icon: 'Document' },
      { title: 'Persona', icon: 'Setting' },
    ]
    const isShowTitle = () => {

    }
    return () => (
      <div>
        <el-radio-group v-model={isCollapse.value} style="margin-bottom: 20px">
          <el-radio-button value={false}>展开</el-radio-button>
          <el-radio-button value={true}>折叠</el-radio-button>
        </el-radio-group>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          collapse={isCollapse.value}
          open={handleOpen}
          close={handleClose}
        >
          {
            MenuMap.map((it, i) => {
              return <el-menu-item index={String(i + 1)} key={i}>
                <el-icon><Icon name={it.icon} /></el-icon>
                {isCollapse.value ? '' : it.title}
              </el-menu-item>
            })
          }
        </el-menu>
      </div>
    );
  }
})