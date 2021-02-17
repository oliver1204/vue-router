1. 确保每个组件都有_router属性
2. $options.route对象化
3. vue.util.defineReactive（this，router，current）当前路径响应式
4. 监听路由变化，view 渲染对应的页面
