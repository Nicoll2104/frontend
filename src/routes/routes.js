import home from "../components/home.vue";
import menu from "../components/menu.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/home", component: home},
  { path: "/menu", component: menu },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

