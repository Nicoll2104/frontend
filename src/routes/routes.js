import Login from "../components/login.vue" 
import Menu from "../components/menu.vue"

import inicio from "../components/inicio.vue"
import presupuesto from '../components/presupuesto.vue'
import Lotes from "../components/lotes.vue"
import Fichas from '../components/ficha.vue'
import Areas from '../components/area.vue'
import Pedidos from '../components/Pedidos.vue'
import Productos from '../components/producto.vue'
import contraseña from '../components/res_clave.vue'
import Dis_presupuesto from '../components/dis_presupuesto.vue'
import Det_pedido from '../components/det_pedido.vue'
import presupuesto_ficha from '../components/presupuesto_ficha.vue'
import Usuario from '../components/usuario.vue'
import Entradas from '../components/entradas.vue'


import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/",component: Login,},
    {path: "/Restableciemiento",component: contraseña,},
    {path: "/menu",component: Menu, 
      children: [
        { path: "/", redirect: "/menu/inicio" },
        { path: "/inicio", component: inicio },
        {path: '/Presupuesto', component:presupuesto},
        {path: '/Fichas', component:Fichas},
        {path: '/Lotes', component:Lotes},
        {path: '/Areas', component:Areas},
        {path: '/Pedidos', component:Pedidos},
        {path: '/Productos', component:Productos},
        {path: '/Dis_presupuesto', component:Dis_presupuesto},
        {path: '/Det_pedido', component:Det_pedido},
        {path: '/Presupuesto_de_ficha', component:presupuesto_ficha},
        {path: '/Usuario', component:Usuario},
        {path: '/entradas', component:Entradas},
      ],
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})

