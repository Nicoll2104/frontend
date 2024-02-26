<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();
const leftDrawerOpen = ref(false);

console.log('menu cargado')

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

let menu2_content = ref([
    { ruta: "", titulo: "Presupuesto", desplegable: [
        {ruta: "/Presupuesto", titulo: "items"},
        {ruta: "/Dis_presupuesto", titulo: "Distribucion"},
        {ruta: "/Presupuesto_de_ficha", titulo: "Presupuesto fichas"},
    ]},
    { ruta: "/Fichas", titulo: "Fichas", desplegable: false},
    { ruta: "/Lotes", titulo: "Lotes", desplegable: false },
    { ruta: "/Areas", titulo: "Areas", desplegable: false },
    { ruta: "/Pedidos", titulo: "Pedido", desplegable: false },
    { ruta: "/Productos", titulo: "Producto", desplegable: false },
    { ruta: "/Usuario", titulo: "Usuario", desplegable: false },
]);





</script>

<template>
    <div>
        <q-layout view="hHh lpR fFf">
            <q-header elevated class="bg-secondary text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title>
                        <q-avatar icon="page_info">

                        </q-avatar>
                        Distribucion De Presupuesto SENA
                    </q-toolbar-title>
                    <router-link to="/">
                        <q-btn dense flat round icon="exit_to_app" color="white" />
                    </router-link>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-secondary" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated style="scrollbar-width: none;">
                <div class="q-pa-md q-gutter menucont">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 1em">
                        <q-avatar color="white" text-color="primary" padding="none" icon="face" style="font-size: 7em" />
                    </div>


                    <router-link
                    v-for="(item, index) in menu1_content" :key="index" :to="item.ruta">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            class="botones_secundarios">{{ item.titulo }}</q-btn>
                    </router-link>


                    <!--🧩🧩🧩🧩-->
                    <q-linear-progress :value="progress" class="q-mt-md" />
                    <!--🧩🧩🧩🧩-->



                    <div class="opcionescont">

                        <router-link 
                        v-for="(item, index) in menu2_content" :key="index" :to="item.ruta">
                    <!-- ❄️❄️Expandibles❄️❄️ -->
                        <q-expansion-item v-if="item.desplegable !== false" :label=item.titulo class="botones_principales"
                        header-class="bg-accent text-primary" expand-icon-class="text-primary">
                                    <router-link
                                    v-for="(item2, index2) in item.desplegable" :key="index2" :to="item2.ruta">
                                        <q-btn no-caps align="between" color="accent" text-color="primary"
                                        icon-right="chevron_right" :label="item2.titulo" class="botones_secundarios" />
                                    </router-link>
                        </q-expansion-item>

                    <!-- ❄️❄️No expandibles❄️❄️ -->
                        <q-expansion-item  v-if="item.desplegable == false" :label=item.titulo class="botones_principales"
                        header-class="bg-accent text-primary" expand-icon-class="text-primary" 
                        expand-icon="chevron_right" expanded-icon="chevron_right">
                        </q-expansion-item>

                    </router-link>
                    
                    </div>

                    <!--🧩🧩🧩🧩-->
                    <q-linear-progress :value="progress" class="q-mt-md" />
                    <!--🧩🧩🧩🧩-->
                </div>
            </q-drawer>

            <q-page-container>
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

.menucont{

}
.opcionescont {
    margin: 10px 0px;

}

.botones_principales {
    margin-top: 10px;
}

.botones_secundarios {
    width: 90%;
    margin: 9px 0px;
}
</style>
