import { createMatcher } from './create-matcher';
import HashHistory from './history/hash';
import install from './install';

/**
 * 入口文件
 */
export default class VueRouter {
  constructor(options) {
    /**
     * 将用户传入的 routes 扁平化处理
     * {'/': 'Home', /about: About, '/about/a': 'a', '/about/b': 'b'}
     */
    this.matcher = createMatcher(options.routes || []);

    // vue 的路由有3种，前端用到的有2种 hash(本次使用) history(h5 API)
    this.history = new HashHistory(this);
    // vue 钩子函数
    this.beforeEachs = [];
  }
  match(location) {
    // 一切换就匹配
    return this.matcher.match(location);
  }
  push(location) {
    this.history.transitionTo(location, () => {
      window.location.hash = location;
    });
  }
  /**
   * @param {*} app  最顶层vue实例
   * 实现两步内容：
   * 1. 取到路由的路径，进行跳转 并匹配到对应的组件进行渲染
   * 2. 第一次匹配成功后 需要监听路由的变化，之后完成后续操作
   */
  init(app) {
    const history = this.history;

    const setupListeners = () => {
      // 跳转成功后的回调
      history.setupListeners(); // 监听路由变化的方法  父
    };
    // 父
    history.transitionTo(
      history.getCurrentLocation(), // 获取当前路径 子
      setupListeners
    );

    history.listen((route) => {
      // 订阅 等路径一变化就执行此方法
      app._route = route;
    });
  }
  beforeEach(cb) {
    this.beforeEachs.push(cb); // 页面切换之前会先执行这个函数
  }
}
/**
 * vue router 使用时必须通过 Vue.ues(VueRouter), 
 * 所以vue router本质上是 Vue 的插件
 * Vue.use是一个用来安装Vue.js插件的方法。
 * 插件通常是一个对象或者函数，如果是对象的话，需要有install方法，
 * 而如果是函数的话，这个函数本身会被当作install方法。
 **/ 
VueRouter.install = install;
