export default {
  functional: true, // 函数式组件
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },

  render(h, { props, children, parent, data }) {
    let route = parent.$route;
    let depth = 0;

    while (parent) {
      // parent.$vnode 占位$vnode
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
