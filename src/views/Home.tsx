import { defineComponent, watchEffect } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'
import { imgFormat, throttle } from "../constant";
import { SongsShow } from "../shared/SongsShow";

export const Home = defineComponent({
  setup(props, context) {
    const images = ref(['http://p1.music.126.net/-9oVfwoh2zYRqJeLZvOqng==/109951169510735610.jpg','http://p1.music.126.net/qFwnmJ7e5iSjSteGEKTKHQ==/109951169508453166.jpg', 'http://p1.music.126.net/K2A6BOGU_Lg2udTmnHaXuw==/109951169510395053.jpg','http://p1.music.126.net/E1azjpK_3Zqm3GEX81DRyg==/109951169508468549.jpg','http://p1.music.126.net/IBpTJnqLoGXqe7icaYJyMg==/109951169508769517.jpg','http://p1.music.126.net/-e0iZA8h5mIgTV1WLm0ryA==/109951169508470770.jpg','http://p1.music.126.net/gOee7XkDHu1E6u6MMf1_JA==/109951169509043473.jpg'])
    const songs = ref(['歌曲1','歌曲2','歌曲3','歌曲4','歌曲5','歌曲6','歌曲7','歌曲1','歌曲2','歌曲3','歌曲4','歌曲5','歌曲6','歌曲7'])
    const songsRef = ref<any>(null)
    const highMarkRef = ref<any>(null)

   
    return () => (
    <div class={s.wrapper}>
      <div class={s.carousel}>
        <el-carousel interval={4000} type="card" height="290px" autoplay={false}>
        {
          images.value.map((it, i) => {
            return <el-carousel-item class={s.image}>
              <img src={imgFormat(it, 730, 284)} alt="" />
            </el-carousel-item>
          })
        }
        </el-carousel>
      
      </div>
      <div class={s.container}>
        <div class={s.box}>
          <div class={s.title}>———— 新歌速递 ————</div>
          <SongsShow songs={songs.value}/>
        </div>
        <div class={s.box}>
          <div>———— 高分推荐 ————</div>
          <SongsShow songs={songs.value}/>
        </div>
        <div class={s.box}>
          <div>———— 猜你喜欢 ————</div>
        </div>
        <div class={s.box}>
          <div>———— 推荐歌单 ————</div>
        </div>
      </div>
    </div>
    )
  },
})
