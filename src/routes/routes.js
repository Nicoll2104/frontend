import home from "../components/home.vue";
import menu from "../components/menu.vue";
import area from "../components/area.vue";
import ficha from "../components/ficha.vue";
import login from "../components/login.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const authGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log(isAuthenticated());
    if (!isAuthenticated()) {
      next({ path: "/" });
      console.log("h");
    } else {
      next();
      console.log("a");
    }
  } else {
    next();
    console.log("b");
  }
};

const routes = [
  { path: "/", component: login },
  {
    path: "/menu",
    meta: { requiresAuth: true },
    beforeEnter: authGuard,
    component: menu,
    children: [
      { path: "", component: home },
      { path: "/home", component: home },
      { path: "/ficha", component: ficha },
      { path: "/area", component: area },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

