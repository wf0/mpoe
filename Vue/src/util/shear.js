/**
 * 分享实现共享文件实现思路
 *  1. 需要 username 、文件id、filename 被邀请人（通常需要重新登录）
 */

export const createShearUrl = (username, fileid, filename) => {
  return `http://localhost:3000/#/invited/${fileid}?username=${username}&filename=${filename}`;
};
