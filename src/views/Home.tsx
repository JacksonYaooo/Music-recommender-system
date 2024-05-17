import { defineComponent, watchEffect, onMounted } from "vue";
import s from "./Home.module.scss";
import { ref } from 'vue'
import { imgFormat, throttle } from "../constant";
import { SongsShow } from "../shared/SongsShow";
import { http } from "../shared/Http";
import axios from "axios";

export const Home = defineComponent({
  setup(props, context) {
    const wrapper = ref<any>(null)
    const images = ref([])
    const songs = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const highSongs = ref([])
    const rankings = ref<{ coverImgUrl: string, name: string, tracks: [], creator: string }[]>([])
    const isLoading = ref(true)

    const requestBanner = async () => {
      const res = await http.get<any>('/banner')
      const bannerList = res.data?.banners
      images.value = bannerList.map(item => imgFormat(item.imageUrl, 730, 284))
    }
    const requestNewSongs = async () => {
      const res = await http.get<any>('/newSongs')
      songs.value = res.data.data.map(item => ({
        album: item.album,
        mp3Url: item.mp3Url
      })).splice(0, 22)
      isLoading.value = false
      wrapper.value.style.height = 'auto'

    }
    const requestHighScore = async () => {
      const res = await http.get<any>('/highScore')
      highSongs.value = res.data.data.map(item => ({
        album: {
          id: item.id,
          blurPicUrl: item.picUrl,
          name: item.name,
          score: item.score,
          artists: [{ name: item.article }]
        },
        mp3Url: ''
      }))
    }
    const requestList = async () => {
      const res1 = await axios.get('http://codercba.com:9002/playlist/track/all?id=19723756&limit=10&offset=1')
      const res2 = await axios.get('http://codercba.com:9002/playlist/track/all?id=3779629&limit=10&offset=1')
      const res3 = await axios.get('http://codercba.com:9002/playlist/track/all?id=2884035&limit=10&offset=1')
      rankings.value = [
        { name: '飙升榜', tracks: res1.data.songs, coverImgUrl: 'http://p1.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg', creator: '网易云音乐' },
        { name: '新歌榜', tracks: res2.data.songs, coverImgUrl: 'http://p1.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg', creator: '网易云音乐' },
        { name: '原创榜', tracks: res3.data.songs, coverImgUrl: 'http://p1.music.126.net/iFZ_nw2V86IFk90dc50kdQ==/109951166961388699.jpg', creator: '原创君' }
      ]
      console.log(rankings.value)
    }
    onMounted(() => {
      wrapper.value.style.height = '100vh'
      requestBanner()
      requestNewSongs()
      requestHighScore()
      requestList()
    })
    return () => (
      <div ref={wrapper} class={s.wrapper} v-loading={isLoading.value} element-loading-text={'加载中...'}>
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
            <SongsShow songs={highSongs.value} />
          </div>
          <div class={s.box}>
            <div class={s.title}>———— 猜你喜欢 ————</div>
            <SongsShow songs={songs.value} />
          </div>
          <div class={s.box}>
            <div class={s.title}>———— 推荐榜单 ————</div>
            <div class={s.wrapper_1}>
              <div class={s.content}>
                {
                  rankings.value.map((item, index) => {
                    return <div class={s.item} key={index}>
                      <div class={s.header}>
                        <div class={s.image}>
                          <img src={imgFormat(item.coverImgUrl, 80,)} alt="" />
                        </div>
                        <div class={s.info}>
                          <div class={s.name}>{item.name}</div>
                          <div class={s.buttonF}>
                            {item.creator}
                          </div>
                        </div>
                      </div>
                      <div class={s.list}>
                        {item.tracks.map((list: any, index: number) => {
                          return <div class={s.listItem} key={index}>
                            <div class={s.index}>{index + 1}</div>
                            <div class={s.info}>
                              <div class={s.name}>{list.name}</div>
                            </div>
                          </div>
                        })}
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
