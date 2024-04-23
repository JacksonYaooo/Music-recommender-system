/// <reference types="vite/client" />

import { AxiosRequestConfig } from 'axios'
declare module 'axios' {
  export interface AxiosRequestConfig {
    _autoLoading?: boolean
    _mock?: string
  }
}
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "@element-plus/*";
// declare module "@element-plus/icons-vue";

type JSONValue = null | boolean | string | number | JSONValue[] | Record<string, JSONValue>

