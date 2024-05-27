import { PropType, defineComponent, onMounted, ref } from "vue";
import s from "./Personal.module.scss";
import { http } from "../shared/Http";
import { imgFormat } from "../constant";
import router from "../router";
import { PersonalInfo } from "./PersonalInfo";

export const Personal = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    const hasSuggest = ref(false)
    // 歌手 选择框
    // 歌曲风格
    // 歌曲年代
    // /ugc/artist/search?keyword=林俊杰
    // /search?keywords=华语&type=1000
    const progress = ref(0)
    const checkedArticle = ref([])
    const checkedType = ref([])
    const checkedYear = ref([])
    const articles = ref<any>([
      { name: '林俊杰', id: 3684, url: '' },
      { name: '陈奕迅', id: 2116, url: '' },
      { name: 'G.E.M.邓紫棋', id: 7763, url: '' },
      { name: '薛之谦', id: 5781, url: '' },
      { name: '汪苏泷', id: 5538, url: '' },
      { name: '毛不易', id: 12138269, url: '' },
      { name: '张杰', id: 6472, url: '' },
      { name: '张碧晨', id: 1024308, url: '' },
      { name: '李荣浩', id: 4292, url: '' }
    ])
    const types = ref<any>([
      { type: '华语', id: 5001 },
      { type: '民谣', id: 1 },
      { type: '轻音乐', id: 2 },
      { type: '说唱', id: 3 },
      { type: '影视原声', id: 4 },
      { type: '怀旧（90年代）', id: 5 },
      { type: '古风', id: 6 },
    ])
    const years = ref<any>([
      { year: '2020年代', id: 1 },
      { year: '2010年代', id: 2 },
      { year: '2000年代', id: 3 },
      { year: '1990年代', id: 4 },
      { year: '1980年代', id: 5 },
      { year: '1970年代', id: 6 },
    ])
    const handleStep = () => {
      switch (progress.value) {
        case 0:
          if (checkedArticle.value.length === 0) return
          break;
        case 1:
          if (checkedType.value.length === 0) return
          break;
        case 2:
          if (checkedYear.value.length === 0) {
            return
          } else {
            const obj = {
              year: checkedYear.value.join(','),
              article: checkedArticle.value.join(','),
              type: checkedType.value.join(',')
            }
            localStorage.setItem('suggest', JSON.stringify(obj))
          }
        default:
          break;
      }
      progress.value = progress.value += 1
    }
    const fetchArticleUrl = async () => {
      articles.value.map(async (it, index) => {
        const articleImg = await x(it.id)
        articles.value[index].url = articleImg
      })
      async function x(id: number) {
        const res = await http.get<any>(`http://localhost:3000/artist/detail?id=${id}`)
        return res.data.data.artist.avatar
      }
    }
    const refresh = () => {
      articles.value = [
        { name: '张博涵', id: 1, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526184133.jpg' },
        { name: '王轶博', id: 2, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526191035.jpg' },
        { name: '张博涵', id: 3, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190739.jpg' },
        { name: '03+', id: 4, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190704.jpg' },
        { name: '个人秀', id: 5, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190710.jpg' },
        { name: '03+', id: 6, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190715.jpg' },
        { name: '洛阳', id: 7, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190724.jpg' },
        { name: '个人秀', id: 8, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190720.jpg' },
        { name: '洛阳', id: 9, url: 'https://jobpost-file-1314966552.cos.ap-shanghai.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240526190728.jpg' }
      ]
    }
    onMounted(async () => {
      const user = localStorage.getItem('loginInfo')
      const suggest = localStorage.getItem('suggest')
      if (user === 'root') {
        hasSuggest.value = true
      } else {
        hasSuggest.value = suggest ? true : false
      }

      setTimeout(() => {
        const x: any = document.querySelector('.el-checkbox-group')
        x.style.display = 'flex'
        x.style.flexWrap = 'wrap'
      })
      await fetchArticleUrl()
    })
    return () => (
      <>
        {
          hasSuggest.value ?
            <PersonalInfo /> :
            <div class={s.suggest}>
              <div style="width: 40rem;">
                <el-steps direction="horizontal" active={progress.value} align-center>
                  <el-step title="选择喜欢的歌手" />
                  <el-step title="选择喜欢的歌曲风格" />
                  <el-step title="选择歌曲年代" />
                </el-steps>
              </div>
              {
                progress.value === 0 ?
                  <div class={s.container}>
                    <div class={s.title}>选择自己比较喜欢的歌手（最少选择一位，最多选择三位）</div>
                    <div class={s.select}>
                      <el-checkbox-group v-model={checkedArticle.value} min={1} max={3}>
                        {
                          articles.value.map(item => {
                            return <div class={s.info}>
                              <img src={imgFormat(item.url, 160)} />
                              <el-checkbox key={item.id}
                                label={item.name} value={item.name}>
                                {item.name}</el-checkbox>
                            </div>
                          })
                        }
                      </el-checkbox-group>
                    </div>
                    <div class={s.refresh} onClick={refresh}>不感兴趣？换一批</div>
                  </div > : (
                    progress.value === 1 ?
                      <div class={s.container}>
                        <div class={s.title}>选择自己比较喜欢的歌曲风格（最少选择一个，最多选择三个）</div>
                        <div class={s.select}>
                          <el-checkbox-group v-model={checkedType.value} min={1} max={3}>
                            {
                              types.value.map(item => {
                                return <el-checkbox key={item.id}
                                  label={item.type} value={item.type} size='large'>
                                  {item.type}</el-checkbox>
                              })
                            }
                          </el-checkbox-group>
                        </div>
                      </div> :
                      (
                        progress.value === 2 ?
                          <div class={s.container}>
                            <div class={s.title}>选择自己比较喜欢的歌曲年代（最少选择一个，最多选择三个）</div>
                            <div class={s.select}>
                              <el-checkbox-group v-model={checkedYear.value} min={1} max={3}>
                                {
                                  years.value.map(item => {
                                    return <el-checkbox key={item.id}
                                      label={item.year} value={item.year} size='large'>
                                      {item.year}</el-checkbox>
                                  })
                                }
                              </el-checkbox-group>
                            </div>
                          </div> : <div class={s.container}>
                            <el-col sm={70} lg={80}>
                              <el-result
                                icon="success"
                                title="已经完成推荐分析"
                                sub-title="返回主页查看推荐结果"
                              >
                              </el-result>
                            </el-col>
                            <div class={s.result}>
                              <el-button type="primary" color='#233649' onClick={() => router.push('/home')}>返回主页</el-button>
                            </div>
                          </div>
                      )
                  )
              }
              {
                progress.value <= 2 ?
                  <div class={s.button}>
                    <el-button type="primary" color='#233649' onClick={handleStep}>{progress.value === 2 ? '完成' : '下一步'}</el-button>
                  </div> : null
              }
            </div >
        }
      </>
    );
  }
})