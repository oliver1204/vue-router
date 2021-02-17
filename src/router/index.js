import Vue from 'vue';
import VueRouter from '../vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
    children: [
      {
        path: 'a',
        component: {
          render(h) {
            return <h1>This is an about page - A</h1>;
          },
        },
      },
      {
        path: 'b',
        component: {
          render(h) {
            return <h1>This is an about page - B</h1>;
          },
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});
// vue router 钩子函数
router.beforeEach((to, from, next) => {
  // 可以写一些获取权限的内容
  console.log(1);
  setTimeout(() => {
    next();
  });
});

router.beforeEach((to, from, next) => {
  // 可以写一些获取权限的内容
  console.log(2);
  setTimeout(() => {
    next();
  });
});

export default router;
