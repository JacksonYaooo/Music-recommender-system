import { PropType, defineComponent } from "vue";
import s from "./Login.module.scss";
import { getAssetsFile } from "../constant";

export const Login = defineComponent({
  setup(props, context) {
    console.log(getAssetsFile('logo.png'))

    return () => (
      <div class={s.wrapper}>
        <div class={s.container}>
          <div class={s.left}>
            <h1>音乐推荐系统</h1>
            <img src={`${getAssetsFile('logo.png')}`} alt="" />
          </div>
          <div class={s.right}>
            <div class={s.sign}>
              <h3>Sign in</h3>
              <input type="text" placeholder='username' />
              <input type="password" placeholder='password' />
              <button>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
})
