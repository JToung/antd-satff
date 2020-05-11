// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}
export function setAuthority(payload) {
  const proAuthority = typeof payload.authority === 'string' ? [payload.authority] : payload.authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  localStorage.setItem('currentAuthority', payload.authority);
  localStorage.setItem('user', JSON.stringify(payload));
  localStorage.setItem('userId', payload.result[0]._id);
  // localStorage.setItem('currentSubstation', JSON.stringify(payload.currentSubstation));
  // localStorage.setItem('substationList', JSON.stringify(payload.substationList));
}

