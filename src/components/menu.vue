<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

let menu1_content = ref([
    { ruta: "/", titulo: "Cerrar Sesión", desplegable: false },
    { ruta: "/home", titulo: "Menu", desplegable: false },
]);

let menu2_content = ref([
    { ruta: "/Presupuesto", titulo: "Presupuesto", desplegable: false },
    { ruta: "/Fichas", titulo: "Fichas", desplegable: false },
    { ruta: "/Lotes", titulo: "Lotes", desplegable: false },
    { ruta: "/Areas", titulo: "Areas", desplegable: false },
    { ruta: "/Pedidos", titulo: "Pedido", desplegable: false },
    { ruta: "/Productos", titulo: "Producto", desplegable: false },
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
                <div class="q-pa-md q-gutter opcionescont">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 1em">
                        <q-avatar color="white" text-color="primary" padding="none" icon="face" style="font-size: 7em" />
                    </div>


                    <router-link class="opcioncont" 
                    v-for="(item, index) in menu1_content" :key="index" :to="item.ruta">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            class="botones_principales">{{ item.titulo }}</q-btn>
                    </router-link>


                    <!--🧩🧩🧩🧩-->
                    <q-linear-progress :value="progress" class="q-mt-md" />
                    <!--🧩🧩🧩🧩-->




                    
                    



                    <q-expansion-item label="Presupuesto" align="between"  style="margin-top: 10px;"
                    header-class="bg-accent text-primary" expand-icon-class="text-primary" >

                                <router-link to="/Fichas" class="opcioncont">
                                    <q-btn no-caps align="between" color="accent" text-color="primary"
                                        icon-right="chevron_right" label="Fichas" class="botones_principales" />
                                </router-link>
                                <router-link to="/Fichas" class="opcioncont">
                                    <q-btn no-caps align="between" color="accent" text-color="primary"
                                        icon-right="chevron_right" label="Fichas" class="botones_principales" />
                                </router-link>

                    </q-expansion-item>









                    <router-link to="/Fichas" class="opcioncont">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="expand_more"
                            label="Fichas" class="botones_principales" />
                    </router-link>
                    <router-link to="/Lotes" class="opcioncont">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="expand_more"
                            label="Lotes" class="botones_principales" />
                    </router-link>
                    <router-link to="/Areas" class="opcioncont">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="expand_more"
                            label="Areas" class="botones_principales" />
                    </router-link>
                    <router-link to="/Pedidos" class="opcioncont">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="expand_more"
                            label="Pedido" class="botones_principales" />
                    </router-link>
                    <router-link to="/Productos" class="opcioncont">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="expand_more"
                            label="Producto" class="botones_principales" />
                    </router-link>

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

.opcioncont {

}

.botones_principales {
    width: 95%;
    margin: 9px 0px;
}
</style>
