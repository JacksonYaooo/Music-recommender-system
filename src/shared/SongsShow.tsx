import { PropType, Ref, defineComponent, ref, watchEffect } from "vue";
import s from "./SongsShow.module.scss";
import { throttle } from "../constant";

export const SongsShow = defineComponent({
  props: {
    songs: {
      type: Array as PropType<string[]>,
      default: []
    },
  },
  setup(props, context) {
    const refs = ref<any>(null)
    const handleWhell = (e) => {
      const delta = e.deltaY || e.detail || e.wheelDelta
      if (delta > 0) {
        animateScroll(refs.value, refs.value.scrollLeft + refs.value.clientWidth / 2)
      } else {
        animateScroll(refs.value, refs.value.scrollLeft - refs.value.clientWidth / 2)
      }
      e.preventDefault()
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
    }
    watchEffect(() => {
      refs.value?.addEventListener('wheel', throttledHandleWheel)
    })
    return () => (
      <div class={s.songsContainer} ref={refs}>
        <div class={s.songs}>
          {
            props.songs.map(song => {
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
    );
  }
})