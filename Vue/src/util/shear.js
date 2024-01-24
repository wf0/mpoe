/**
 * 分享实现共享文件实现思路
 *  1. 需要 username 、文件id、filename 被邀请人（通常需要重新登录）
 */
import { ElMessage } from "element-plus";
export const createShearUrl = (username, fileid, filename) => {
  if (!fileid || !filename)
    return ElMessage.error(
      `分享文件参数缺失: fileid=${fileid}, filename=${filename}`
    );

  // 解析路径
  let baseURL = window.location.origin;
  return `${baseURL}/#/invited/${fileid}?username=${username}&filename=${filename}`;
};
