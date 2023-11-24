import home from "../components/home.vue";
import menu from "../components/menu.vue";
import area from "../components/area.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/home", component: home},
  { path: "/menu", component: menu },
  { path: "/area", component: area},
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

