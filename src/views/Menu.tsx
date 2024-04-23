import { defineComponent, watchEffect } from "vue";
import { ref } from 'vue'
import { Icon } from "../shared/Icon";
import { IconType } from '../shared/Icon'
import { useRoute } from "vue-router";
interface IMenu {
  title: string;
  route: String;
  icon: IconType;
}

export const Menu = defineComponent({
  setup: (props, context) => {
    const isCollapse = ref(true)
    const route = useRoute()
    const currentRoute = ref('0')
    const isLoading = ref(true)

    const MenuMap: IMenu[] = [
      { title: '个人中心', route: 'personal', icon: 'IconMenu' },
      { title: '主页', route: 'home', icon: 'IconMenu' },
      { title: '歌曲', route: 'songs', icon: 'Document' },
      { title: '我的喜欢', route: 'mylike', icon: 'Setting' },
      { title: '数据展示', route: 'data', icon: 'Setting' },
    ]
    watchEffect(() => {
      const routePath = route.path.split('/')[1]
      const currentMenuIndex = MenuMap.findIndex(it => it.route === routePath)
      currentRoute.value = String(currentMenuIndex + 1)
      isLoading.value = false
    })

    return () => (
      <>
        {
          isLoading.value ?
            <div>loading</div> :
            <div style='height: 100vh;'>
              <el-menu
                default-active={currentRoute.value}
                style="height: 100vh; borderRight: none;width: 5rem;fontSize: 2rem;"
                background-color='#233649'
                text-color='#fff'
                active-text-color='#f57b70'
              >
                {
                  MenuMap.map((it, i) => {
                    return <router-link style='text-decoration: none;' to={it.route}>
                      <el-menu-item style='height: 10vh; fontSize: 0.4rem;' index={String(i + 1)} key={i}>
                        <el-icon><Icon name={it.icon} /></el-icon>
                        {it.title}
                      </el-menu-item>
                    </router-link>
                  })
                }
              </el-menu>
            </div>
        }
      </>
    );
  }
})