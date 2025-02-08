import History from './base';

export default class HashHistory extends History {
  constructor(router) {
    super(router);
    ensureSlash(); //  保证页面一加载就会有hash
  }
  getCurrentLocation() {
    var href = window.location.href;
    var index = href.indexOf('#');
    // empty path
    if (index < 0) {
      return '';
    }

    href = href.slice(index + 1);

    return href;
  }
}

function ensureSlash(params) {
  if (window.location.hash) {
    // 兼容性有问题 IE
    return;
  }

  window.location.hash = '/';
}
