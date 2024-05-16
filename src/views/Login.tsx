import { PropType, defineComponent, reactive, ref } from "vue";
import s from "./Login.module.scss";
import { getAssetsFile } from "../constant";

export const Login = defineComponent({
  setup(props, context) {
    const loginInfo = ref('')
    const right = ref<any>(null)
    const left = ref<any>(null)
    const logo = ref<any>(null)
    const toastStatus = ref<boolean>(true)
    const submit = () => {
      if (!loginInfo.value) return
      localStorage.setItem('loginInfo', loginInfo.value)
    }
    const create = () => {
      right.value.style.transition = 'width 0.3s ease'
      left.value.style.transition = 'width 0.3s ease'
      logo.value.style.transition = 'transform 0.3s ease'

      logo.value.style.transform = 'rotate(90deg)'
      right.value.style.width = '17rem'
      left.value.style.width = '17rem'
      setTimeout(() => {
        toastStatus.value = !toastStatus.value
        logo.value.style.transform = 'rotate(0deg)'
        left.value.style.width = '10.2rem'
        right.value.style.width = '23.8rem'
      }, 500)
    }
    return () => (
      <div class={s.wrapper}>
        <div class={s.container}>
          <div class={s.left} ref={left}>
            <h1>音乐推荐系统</h1>
            <img ref={logo} src={`${getAssetsFile('logo.png')}`} alt="" />
          </div>
          <div class={s.right} ref={right}>
            <div class={s.sign}>
              <h3>{toastStatus.value ? 'Sign in' : 'Create'}</h3>
              <input type="text" placeholder='username' v-model={loginInfo.value} />
              <input type="password" placeholder='password' />
              <button onClick={submit}>{toastStatus.value ? 'Login' : 'Create'}</button>
            </div>
            <div class={s.toast} onClick={create}>{toastStatus.value ? '没有账号，立即注册' : '点击按钮注册'}</div>
          </div>
        </div>
      </div>
    );
  }
})
