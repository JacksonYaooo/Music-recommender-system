import { PropType, defineComponent, onMounted, ref } from "vue";
import s from "./Songs.module.scss";
import { useRoute } from "vue-router";
import { http } from "../shared/Http";
import { VideoPlay, FolderAdd, Reading } from '@element-plus/icons-vue'
import { timestampToDate } from "../constant";

export const Songs = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup(props, context) {
    const route = useRoute()
    const songId = route.query.id
    const songScore = route.query.score
    const songInfo = ref<any>({})
    const lyric = ref<string>('')
    const lyricRef = ref<any>(null)
    const isShowAll = ref('')

    const show = ref(false)
    const content = ref<any>([])
    const simSongs = ref<any>([])
    const requestSongs = async () => {
      const res = await http.get<any>(`/song/detail?ids=${songId}`)
      songInfo.value = res.data?.songs?.[0]
    }
    const requestSimSongs = async () => {
      const res = await http.get<any>(`/simSong?id=${songId}`)
      simSongs.value = res.data.songs
    }
    const requestContent = async () => {
      const res = await http.get<any>(`/getContent?id=${songId}`)
      content.value = res.data
    }
    const requestLyric = async () => {
      const res = await http.get<any>(`/lyric?id=${songId}`)
      lyric.value = res.data.lrc.lyric
      formatLyrics()
    }
    const formatLyrics = () => {
      // 使用正则表达式匹配歌词内容，去除时间戳
      const lyricsOnly = lyric.value.replace(/\[\d{2}:\d{2}(?:\.\d{3})?\]\s*/g, '');
      // 分割歌词为数组，处理每行内容
      const lines = lyricsOnly.split('\n').map(line => {
        // 如果行不为空，则包装在<p>标签内以支持换行
        return line.trim() ? `<p>${line}</p>` : '';
      }).join('')
      // 将处理后的歌词赋值给formattedLyrics
      lyric.value = lines
      isShowAll.value = lines.split('</p>').slice(0, 8).join('</p>')
      // lyricAllRef.value.innerHTML = isShowAll.value
      lyricRef.value.innerHTML = isShowAll.value
    }
    const handleShow = () => {
      show.value = !show.value
      lyricRef.value.innerHTML = show.value ? lyric.value : isShowAll.value
    }

    function sliceScore(score) {
      if(!score) return
      let x = String(score * 10)
      const y = x.split('.')
      return y[0] + '.' + y[1]?.slice(0, 2)
  }
    onMounted(() => {
      requestSongs()
      requestLyric()
      requestSimSongs()
      requestContent()
    })
    return () => (<>
      {
        songId ? <div class={s.hasSong}>
          <div class={s.container}>
            <div class={s.x}>
              <div class={s.y}>
                <div class={s.songImg}>
                  <div class={s.cover}>
                    <img src={songInfo.value?.al?.picUrl} alt="" />
                    <div class={s.score}>{songScore}</div>
                  </div>
                </div>
                <div class={s.songInfo}>
                  <div class={s.songName}>
                    <div class={s.info}>单曲</div>
                    <div class={s.name}>
                      <span>{songInfo.value.name}</span>
                      <span class={s.en}>{songInfo.value?.tns?.[0]}</span>
                    </div>
                  </div>
                  <div class={s.info}>歌手：<span>
                    {songInfo.value?.ar ? (
                      songInfo.value.ar.length > 1
                        ? `${songInfo.value.ar.map(artist => artist.name).join(' / ')}`
                        : songInfo.value.ar[0].name
                    ) : ''}
                  </span></div>
                  <div class={s.info}>所属专辑：<span>{songInfo.value?.al?.name || ''}</span></div>
                  <div class={s.button}>
                    <el-button type="primary" icon={VideoPlay} color='#233649'>播放</el-button>
                    <el-button icon={FolderAdd} color='#f1f1f1'>收藏</el-button>
                    <el-button icon={Reading} color='#f1f1f1'>({content.value.length})</el-button>
                  </div>
                  <div ref={lyricRef} class={s.lyric}></div>
                  <span class={s.show} onClick={handleShow}>{show.value ? '隐藏 ↑' : '展开 ↓'}</span>
                </div>
                <div class={s.songsim}>
                  <div class={s.title}>相似歌曲</div>
                  <div class={s.songs}>
                    {
                      simSongs.value.length > 0 && simSongs.value.map(item => {
                        return <div class={s.contaniner}>
                          <div class={s.info}>
                            <div>{item.name}</div>
                            <div class={s.author}>{item?.artists.length > 1
                              ? `${item.artists.map(artist => artist.name).join(' & ')}`
                              : item?.artists[0]?.name
                            }</div>
                          </div>
                          <div class={s.play}>
                            <el-icon size='16'><VideoPlay /></el-icon>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
              </div>
              <div class={s.content}>
                <div class={s.title}>
                  <div>评论 &nbsp;</div>
                  <div class={s.count}>共有{content.value.length}条评论</div>
                </div>
                {
                  content.value.map(item => {
                    return <div class={s.ctx}>
                      <div class={s.img}>
                        <img src={item.user.avatarUrl} alt="" />
                      </div>
                      <div class={s.info}>
                        <div class={s.a}>
                          <span>{item.user.nickName}: </span>
                        {item.content}</div>
                        <div class={s.b}>
                          <div>{timestampToDate(item.time)}</div>
                          <div>{sliceScore(item.score)}</div>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>

        </div>
          :
          <div class={s.noSong}>2</div>
      }
    </>
    )
  }
})