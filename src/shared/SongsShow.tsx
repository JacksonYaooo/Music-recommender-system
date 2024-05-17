import { PropType, Ref, defineComponent, ref, watchEffect } from "vue";
import s from "./SongsShow.module.scss";
import { throttle } from "../constant";
import { useRouter } from "vue-router";

export const SongsShow = defineComponent({
  props: {
    songs: {
      type: Array as PropType<any[]>,
      default: []
    },
  },
  setup(props, context) {
    const refs = ref<any>(null)
    const router = useRouter()
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
    const handleClick = (song) => {
      console.log(song)
      const id = song.album.id
      router.push(`/songs?id=${id}`)
    }
    return () => (
      <div class={s.songsContainer} ref={refs}>
        <div class={s.songs}>
          {
            props.songs.length > 0 && props.songs.map(song => {
              return <div class={s.song} onClick={() => handleClick(song)}>
                <img class={s.bg} src={song?.album?.blurPicUrl} alt="" />
                <div class={s.songName}>{song?.album?.name}</div>
                <div class={s.singer}>
                  {song?.album?.artists.length > 1
                    ? `${song.album.artists.map(artist => artist.name).join(' & ')}`
                    : song?.album?.artists[0]?.name
                  }
                </div>
                <div class={s.songInfo}>
                  <span class={s.score}>{song?.album?.score || ''}</span>
                  <i class="iconfont icon-aixin"></i>
                </div>
              </div>
            })
          }
        </div>
      </div>
    );
  }
})