import { defineComponent, watchEffect, onMounted } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'
import { imgFormat, throttle } from "../constant";
import { SongsShow } from "../shared/SongsShow";
import { http } from "../shared/Http";

export const Home = defineComponent({
  setup(props, context) {
    const images = ref([])
    const songs = ref(['歌曲1', '歌曲2', '歌曲3', '歌曲4', '歌曲5', '歌曲6', '歌曲7', '歌曲1', '歌曲2', '歌曲3', '歌曲4', '歌曲5', '歌曲6', '歌曲7'])

    const requestBanner = async () => {
      const res = await http.get<any>('/banner')
      const bannerList = res.data?.banners
      images.value = bannerList.map(item => imgFormat(item.imageUrl, 730, 284))
      console.log(images.value)
    }
    onMounted(() => {
      requestBanner()
    })
    return () => (
      <div class={s.wrapper}>
        <div class={s.activeBg}></div>
        <div class={s.carousel}>
          <el-carousel interval={2000} type="card" height="290px" autoplay={true}>
            {
              images.value.map((it, i) => {
                return <el-carousel-item class={s.image}>
                  <img src={it} alt="" />
                </el-carousel-item>
              })
            }
          </el-carousel>

        </div>
        <div class={s.container}>
          <div class={s.box}>
            <div class={s.title}>———— 新歌速递 ————</div>
            <SongsShow songs={songs.value} />
          </div>
          <div class={s.box}>
            <div class={s.title}>———— 高分推荐 ————</div>
            <SongsShow songs={songs.value} />
          </div>
          <div class={s.box}>
            <div class={s.title}>———— 猜你喜欢 ————</div>
            <SongsShow songs={songs.value} />
          </div>
          <div class={s.box}>
            <div class={s.title}>———— 推荐歌单 ————</div>
            <SongsShow songs={songs.value} />
          </div>
        </div>
      </div>
    )
  },
})
