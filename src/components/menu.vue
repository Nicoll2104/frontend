<script setup>
import { Cookies } from 'quasar';
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUsuarioStore } from "../stores/usuario.js"

const UsuarioStore = useUsuarioStore()
const route = useRoute();
const leftDrawerOpen = ref(false);
const usuario = ref(UsuarioStore.sesion.usuarios || {usuarios:{
    "id":'',
    "nombre":'',
    "cedula":'',
    "correo":'',
    "telefono":'',
    "contrasena":'',
    "rol":''
  }})

console.log('menu cargado')
console.log(usuario)

/* if (route.query.respuesta) {
    usuario = JSON.parse(route.query.respuesta);
    console.log(usuario);
  } else {
    // Si no hay usuario en la URL, redirige al principio de la aplicación
    router.push('/');
  }
 */

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

let menu1_content = ref([
    { ruta: "/", titulo: "Cerrar Sesión", desplegable: false },
    { ruta: "/inicio", titulo: "Inicio", desplegable: false },
]);

const rol = Cookies.get('rol')

let menu2_content = ref({
    Administrador: [
    { ruta: "/Dependencias", titulo: "Dependencias", desplegable: false},
    { ruta: "/Destino", titulo: "Destino", desplegable: false},
    { ruta: "/Lotes", titulo: "Lotes", desplegable: false },
    { ruta: "/Areas", titulo: "Area tematica", desplegable: false },
    { ruta: "/Pedidos", titulo: "Pedidos", desplegable: false },
    { ruta: "/Productos", titulo: "Producto", desplegable: false },
    { ruta: "/Usuario", titulo: "Usuario", desplegable: false },
    { ruta: "", titulo: "Compras", desplegable: [
        {ruta: "/Contrato", titulo: "Contrato"},
        {ruta: "/proveedor", titulo: "Proveedor"},
        {ruta: "/Proceso", titulo: "Proceso"},
    ] },
    ],
    Instructor:[
    { ruta: "/Dependencias", titulo: "Dependencias", desplegable: false},
    { ruta: "/Destino", titulo: "Destino", desplegable: false},
    { ruta: "/Lotes", titulo: "Lotes", desplegable: false },
    { ruta: "/Areas", titulo: "Area tematica", desplegable: false },
    { ruta: "/Pedidos", titulo: "Pedidos", desplegable: false },
    { ruta: "/Productos", titulo: "Producto", desplegable: false },
    { ruta: "/Usuario", titulo: "Usuario", desplegable: false },
    { ruta: "", titulo: "Compras", desplegable: [
        {ruta: "/Contrato", titulo: "Contrato"},
        {ruta: "/proveedor", titulo: "Proveedor"},
        {ruta: "/Proceso", titulo: "Proceso"},
    ] },
    ],
    Bodega:[
    { ruta: "/Dependencias", titulo: "Dependencias", desplegable: false},
    { ruta: "/Destino", titulo: "Destino", desplegable: false},
    { ruta: "/Lotes", titulo: "Lotes", desplegable: false },
    { ruta: "/Areas", titulo: "Area tematica", desplegable: false },
    { ruta: "/Pedidos", titulo: "Pedidos", desplegable: false },
    { ruta: "/Productos", titulo: "Producto", desplegable: false },
    { ruta: "/Usuario", titulo: "Usuario", desplegable: false },
    { ruta: "", titulo: "Compras", desplegable: [
        {ruta: "/Contrato", titulo: "Contrato"},
        {ruta: "/proveedor", titulo: "Proveedor"},
        {ruta: "/Proceso", titulo: "Proceso"},
    ] },
    ],
});





</script>

<template>
    <div>
        <q-layout view="hHh lpR fFf" >
            <q-header elevated class="bg-green text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title>
                        <q-avatar icon="page_info" class="titulo"/>
                        Distribucion De Presupuesto SENA
                    </q-toolbar-title>
                    <router-link to="/">
                        <q-btn dense flat round icon="exit_to_app" color="white" />
                    </router-link>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-green" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated style="scrollbar-width: none;">
                <div class="q-pa-md menucont">
                    <q-div class="q-pa-md q-gutter-sm column">
                        <router-link to="/perfil">
                        <q-avatar class="cursor-pointer bg-dark q-mx-auto shadow-4 border-radius avatarcont"   color="white" text-color="dark" size="150px"  rounded>
                            <q-card floating class="no-box-shadow bg-white text-black absolute-top text-subtitle2 text-weight-bold text-white q-px-sm q-pb-sm q-mx-auto rollname">
                                {{ usuario.rol }}
                            </q-card>

                                <img src="https://cdn.quasar.dev/img/avatar3.jpg" class="z-top avatarimg">
                        </q-avatar>
                    </router-link>
                        <q-car class="q-mx-auto q-mt-md text-h3 text-weight-bold text-white column text-capitalize">
                            {{ usuario.nombre }}
                        </q-car>
                        
                    </q-div>


                    <router-link
                    v-for="(item, index) in menu1_content" :key="index" :to="item.ruta">
                        <q-btn no-caps align="between" color="dark" text-color="black" icon-right="chevron_right"
                            class="botones_secundarios">{{ item.titulo }}</q-btn>
                    </router-link>


                    <!--🧩🧩🧩🧩-->
                    <q-linear-progress class="q-mt-md" />
                    <!--🧩🧩🧩🧩-->



                    <div class="opcionescont">

                        <router-link 
                        v-for="(item, index) in menu2_content[rol]" :key="index" :to="item.ruta">
                    <!-- ❄️❄️Expandibles❄️❄️ -->
                        <q-expansion-item v-if="item.desplegable !== false" :label=item.titulo class="botones_principales"
                        header-class="bg-dark text-black" expand-icon-class="text-black">
                                    <router-link
                                    v-for="(item2, index2) in item.desplegable" :key="index2" :to="item2.ruta">
                                        <q-btn no-caps align="between" color="dark" text-color="black"
                                        icon-right="chevron_right" :label="item2.titulo" class="botones_secundarios" />
                                    </router-link>
                        </q-expansion-item>

                    <!-- ❄️❄️No expandibles❄️❄️ -->
                        <q-expansion-item  v-if="item.desplegable == false" :label=item.titulo 
                        class="botones_principales q-my-sm"
                        header-class="bg-dark text-black rounded-borders" expand-icon-class="text-black" 
                        expand-icon="chevron_right" expanded-icon="chevron_right"  >
                        </q-expansion-item>

                    </router-link>
                    
                    </div>

                    <!--🧩🧩🧩🧩-->
                    <q-linear-progress class="q-mt-md" />
                    <!--🧩🧩🧩🧩-->
                </div>
            </q-drawer>

            <q-page-container class="bg-grey-1 absolute-full ">
                <router-view />
            </q-page-container>

        </q-layout>
    </div>
</template>

<style scoped>
* {
    font-size: large;
    text-align: center;
}

.botones_secundarios {
    width: 90%;
    margin: 9px 0px;
}

.avatarcont{
    transition: padding ease 0.2s, transform ease 0.2s;
}

.rollname{
    width: min-content;
    transition: transform ease 0.2s;
}

.avatarcont:hover{
    padding: 10px;
    transform: translate(0% , 0%);
}

.avatarcont:hover .rollname{
    width: min-content;
    transform: translate(0 , -60%);
}


</style>
