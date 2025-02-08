import { create } from 'lodash';

export function createRoute(record, location) {
  let res = []; // 如果匹配到了路径，需要将这个路径放进去

  if (record) {
    while (record) {
      res.unshift(record);
      record = record.parent;
    }
  }

  return {
    ...location,
    matched: res,
  };
}
// 执行钩子函数 执行异步函数
function runQueue(queue, iterator, cb) {
  function step(index) {
    if (index == queue.length) return cb(); // 更新视图
    let hook = queue[index];

    iterator(hook, () => step(index + 1));
  }
  step(0); // 一步一步走
}
export default class History {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, {
      path: '/',
    });
  }
  setupListeners() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(window.location.hash.slice(1));
    });
  }
  transitionTo(location, callback) {
    let r = this.router.match(location);
    if (
      location == this.current.path &&
      r.matched.length == this.current.matched.length
    ) {
      return;
    }
    callback && callback();
    // 依次执行钩子函数
    let queue = this.router.beforeEachs;
    const iterator = (hook, next) => {
      // 调用用户的方法 传入next
      hook(this.current, r, next);
    };
    runQueue(queue, iterator, () => {
      this.updateRoute(r);
    });
  }
  updateRoute(r) {
    this.current = r; // 将当前路径更新
    this.cb && this.cb(r); // 告诉_route属性来更新， 更新后视图后重新更新
  }
  listen(cb) {
    this.cb = cb;
  }
}
