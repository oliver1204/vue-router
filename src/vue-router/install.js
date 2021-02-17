import View from './components/view';
import Link from './components/link';

let _Vue;

const install = (Vue) => {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  // 默认希望将此router放到任何组件上
  Vue.mixin({
    beforeCreate() {
      // 判断是不是根实例
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router;

        // 路由的初始化
        this._router.init(this);
        // 将current属性定义成响应式的 这样稍后更新current就可以更新视图
        // 这个对象上的方法不建议用户直接使用 这个对象是可以改变的

        // vue.observable 2.6
        // 给当前对象增加一个_route属性，他取自当前history的current属性
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    },
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    },
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    },
  });

  // 全局指令
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);
};

export default install;
