import { defineComponent, watchEffect } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'
import { throttle } from "../constant";

export const Home = defineComponent({
  setup(props, context) {
    const images = ref([1,2,3,4,5])
    const songs = ref(['歌曲1','歌曲2','歌曲3','歌曲4','歌曲5','歌曲6','歌曲7','歌曲1','歌曲2','歌曲3','歌曲4','歌曲5','歌曲6','歌曲7'])
    const songsRef = ref<any>(null)

    const handleWhell = (event) => {
      const delta = event.deltaY || event.detail || event.wheelDelta
      if (delta > 0) {
        animateScroll(songsRef.value, songsRef.value.scrollLeft + songsRef.value.clientWidth / 2)
      } else {
        animateScroll(songsRef.value, songsRef.value.scrollLeft - songsRef.value.clientWidth / 2)
      }
      event.preventDefault()
    }
    const throttledHandleWheel = throttle(handleWhell, 500)
    const animateScroll = (element, targetScrollLeft, duration = 500) => {
      const startScrollLeft = element.scrollLeft
      const distance = targetScrollLeft - startScrollLeft
      const startTime = performance.now()
    
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)
        element.scrollLeft = startScrollLeft + distance * progress
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
    
      requestAnimationFrame(animate)
    };
    watchEffect(() => {
      songsRef.value?.addEventListener('wheel', throttledHandleWheel)
    })
   
    return () => (
    <div class={s.wrapper}>
      <div class={s.carousel}>
        <el-carousel interval={4000} type="card" height="20rm">
        {
          images.value.map((it, i) => {
            return <el-carousel-item class={s.image}>
              <h3 text="2xl" justify="center">{ it }</h3>
            </el-carousel-item>
          })
        }
        </el-carousel>
      
      </div>
      <div class={s.container}>
        <div class={s.box}>
          <div class={s.title}>———— 新歌速递 ————</div>
          <div class={s.songsContainer} ref={songsRef}>
            <div class={s.songs}>
              {
                songs.value.map(song => {
                  return <div class={s.song}>
                    <div class={s.bg}>fengmian</div>
                    <div class={s.songName}>修炼爱情</div>
                    <div class={s.singer}>林俊杰</div>
                    <div class={s.songInfo}>
                      <span class={s.score}>9.8</span>
                      <span class={s.like}>收藏</span>
                    </div>
                  </div>
                })
              }
            </div>
          </div>

        </div>
        <div class={s.box}>
          <div>———— 高分推荐 ————</div>
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
