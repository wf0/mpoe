/**
 *  IMPORTANT 请保持端口一致性：
 *  node/base.config.js 中也有三个端口，因项目不一致，打包后会导致端口出错，因此，请手动保持一致
 */

// vue 项目端口
export const vue_port = 3000;

// server PORT （业务端口）
export const server_port = 5000;

//  YJS PORT (yjs-quill协同的ws服务端口) Luckysheet PORT （luckysheet 协同 ws 服务端口）
export const ws_port = 9000;
