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
      if (currentMenuIndex !== -1) {
        isLoading.value = false
      }
    })

    return () => (
      <>
        {
          isLoading.value ?
            <div>loading</div> :
            <div style='height: 100vh;'>
              <el-menu
                default-active={currentRoute.value}
                style="height: 100vh"
                background-color='#374f67'
                text-color='#fff'
                active-text-color='#f57b70'
                collapse={!isCollapse.value}
              >
                {
                  MenuMap.map((it, i) => {
                    return <router-link style='text-decoration: none;' to={it.route}>
                      <el-tooltip
                        disabled={isCollapse.value}
                        content={it.title}
                        raw-content
                        hide-after={0}
                        placement='right'
                      >
                        <el-menu-item style='height: 10vh' index={String(i + 1)} key={i}>
                          <el-icon><Icon name={it.icon} /></el-icon>
                          {isCollapse.value ? it.title : ''}
                        </el-menu-item>
                      </el-tooltip>

                    </router-link>
                  })
                }
                <el-switch
                  v-model={isCollapse.value}
                  class="ml-2"
                  size='large'
                  width='60'
                  inline-prompt
                  style="--el-switch-on-color: #769ba6; --el-switch-off-color: #769ba6;position: fixed; bottom: 0;"
                  active-text="折叠"
                  inactive-text="展开"
                />
              </el-menu>
            </div>
        }
      </>
    );
  }
})