## 原理概括总结

vue router 使用时必须通过 Vue.ues(VueRouter),  所以vue router本质上是 Vue 的插件。

Vue.use 是一个用来安装Vue.js插件的方法。插件通常是一个对象或者函数，如果是对象的话，需要有install方法，而如果是函数的话，这个函数本身会被当作install方法。

当用户使用vue router 时，需要先 new VueRouter, 

```js
const routes = [{
  path: '/',
  component: Home,
}]
const router = new VueRouter({
  routes,
});

```
此时，生成了一个关于 routes 和 views 的 map 关系.

```js
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
}

```

当用户使用 `Vue.use(VueRouter)` 时，调用 VueRouter 的 install 方法, VueRouter 通过 Vue 的 defineReactive 方法实现实现实时自动更新。

```js
const install = (Vue) => {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  // 默认希望将此router放到任何组件上
  // 通过 Vue 插件机制注入 $router 和 $route。
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
```

当用户通过 `<router-link>` 或 `router.push()`触发导航时，VueRouter 调用 matcher.match() 匹配路由记录，解析目标路由。最后更新 currentRoute 的响应式值。触发 `<router-view>` 重新渲染组件。

```js
  match(location) {
    // 一切换就匹配
    return this.matcher.match(location);
  }
  push(location) {
    // 确认导航, 完成view转换
    this.history.transitionTo(location, () => {
      window.location.hash = location;
    });
  }
```

  
## 1. React 路由

- 不同路径渲染不同的组件
- 有两种实现方式

- HashRouter：利用 hash 实现路由切换
- BrowserRouter：利用 h5 API 实现路由切换

### 1.1 HashRouter

利用 hash 实现路由切换

```js
<a href="#/a"> a </a>;

window.addEventListener('hashchange', () => {
  console.log(window.location.hash);
});
```

### 1.2 BrowserRouter

利用 h5 API 实现路由切换

#### 1.2.1 history

- history: 浏览器窗口有一个 history 对象，提供了一系列方法, 用来保存浏览历史, 并允许在浏览历史之间移动。
- pushState：HTML5 为 history 对象添加了两个新方法，history.pushState()和 history.replaceState()，用来在浏览历史中添加和修改记录。

> history.pushState 方法接受三个参数，依次为：

> state：一个与指定网址相关的状态对象，popstate 事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填 null。

> title：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填 null。

> url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

- popstate 事件

> 每当同一个文档的浏览历史（即 history 对象）出现变化时，就会触发 popstate 事件。

> 需要注意的是，仅仅调用 pushState 方法或 replaceState 方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 back、forward、go 方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

> 使用的时候，可以为 popstate 事件指定回调函数。这个回调函数的参数是一个 event 事件对象，它的 state 属性指向 pushState 和 replaceState 方法为当前 URL 所提供的状态对象（即这两个方法的第一个参数）。

```js
window.onpopstate = function (event) {
  console.log('location: ' + document.location);

  console.log('state: ' + JSON.stringify(event.state));
};
```

## 2. router api

[api](https://reactrouter.com/web/api/withRouter)


