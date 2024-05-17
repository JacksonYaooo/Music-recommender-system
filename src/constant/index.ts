export const throttle = (callback, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    callback(...args);
  };
};
export function imgFormat(url: string, width: number, height = width) {
  return url + `?param=${width}x${height}`;
}

// 获取assets静态资源
export const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href;
};

export function timestampToDate(timestamp) {
  // 假设你有一个时间戳（毫秒为单位）

  // 创建一个新的Date对象，将时间戳作为参数传递
  var date = new Date(timestamp);

  // 使用Date对象的方法来获取年份、月份和日期
  var year = date.getFullYear(); // 获取年份
  var month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份（注意月份是从0开始的，所以需要+1）
  var day = String(date.getDate()).padStart(2, "0"); // 获取日期

  // 将这些部分组合成一个格式化的日期字符串，并添加“年”、“月”和“日”
  var formattedDate = year + "年" + month + "月" + day + "日";
  return formattedDate
}
