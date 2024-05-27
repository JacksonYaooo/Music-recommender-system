import { PropType, defineComponent } from "vue";
import s from "./PersonalInfo.module.scss";
import { useRouter } from "vue-router";

export const PersonalInfo = defineComponent({
  setup(props, context) {
    const router = useRouter()
    const loginout = () => {
      localStorage.removeItem('loginInfo')
      localStorage.removeItem('suggest')
      router.push('/login')
    }
    return () => (
      <div class={s.wrapper}>
        <div class={s.box1}></div>
        <div class={s.box2}></div>
        <div class={s.container}>
          <div class={s.img}></div>
          <div class={s.info}>
            <h1>Huang Mengyao</h1>
            <div class={s.cents}>
              <span>"灾祸中见机会，乐观者之光。"</span>
            </div>
          </div>
          <div class={s.loginout} onClick={loginout}>
            <el-tooltip
              class="box-item"
              effect="light"
              content="退出登录"
              placement="right"
            >
              <i class="iconfont icon-tuichudenglu"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    );
  }
})