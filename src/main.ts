import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/css/reset.css";
import "./assets/css/vars.scss";
import "./assets/css/icon.css";

import router from "./router";
import { App } from "./App";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.mount("#app");
