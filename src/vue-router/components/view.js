export default {
  name: 'RouterView',
  functional: true, // 函数式组件
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },

  render(h, { props, children, parent, data }) {
    let route = parent.$route; // 通过注入获取当前路由
    let depth = 0; // 嵌套层级
    
    while (parent) {
      // parent.$vnode 占位 $vnode
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }
    data.routerView = true;
    let record = route.matched[depth];

    if (!record) {
      return h();
    }
    return h(record.component, data);
  },
};
