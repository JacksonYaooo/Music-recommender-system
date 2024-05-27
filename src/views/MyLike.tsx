import { PropType, defineComponent, onMounted, ref, watch } from "vue";
import s from "./MyLike.module.scss";
import { http } from "../shared/Http";
import router from "../router";

export const MyLike = defineComponent({
  setup() {
    const tableData = ref([])
    const requestMySongs = async () => {
      const res = await http.get<any>('/getMyLike')
      tableData.value = res.data
    }
    const skipSongDetail = (x) => {
      router.push(`/songs?id=${x.id}&score=${x.score}&like=1`)
    }
    onMounted(() => {
      requestMySongs()
    })
    return () => (<>
      {
        <div class={s.noSong}>
          <div class={s.container}>
            <div class={s.info}>
              <div>我喜欢的歌曲</div>
            </div>
            <div class={s.list}>
              <div class={s.header}>
                <span>歌曲列表</span>
                <span class={s.songNum}>{tableData.value.length}首歌</span>
              </div>
              <div class={s.songs}>
                <el-table data={tableData.value} stripe onRowClick={skipSongDetail} >
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="name" label="歌曲标题" />
                  <el-table-column prop="article" label="歌手" width="180" />
                  <el-table-column prop="type" label="风格" width="180" />
                  <el-table-column prop="publishTime" label="发行时间" width="180" />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      }
    </>
    )
  }
})