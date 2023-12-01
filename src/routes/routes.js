
/* 
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
}; */
import Login from "../components/login.vue" 
import Menu from "../components/menu.vue"
import home from "../components/home.vue"




import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/",component: Login,},
    {path: "/menu",component: Menu, 
      children: [
        { path: "/", redirect: "/menu/home" },
        { path: "/home", component: home }

      ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})

