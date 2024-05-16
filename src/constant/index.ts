export const throttle = (callback, delay) => {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    callback(...args)
  }
}
export function imgFormat(url:string,width:number,height = width){
  return url + `?param=${width}x${height}`
}

// 获取assets静态资源
export  const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href
}
