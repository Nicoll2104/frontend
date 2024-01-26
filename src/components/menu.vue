<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
console.log(router.getRoutes());

const leftDrawerOpen = ref(false)



function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}



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

            <q-drawer class="bg-secondary" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated>
                <div class="q-pa-md q-gutter opcionescont">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 1em">
                        <q-avatar color="white" text-color="primary" padding="none" icon="face" style="font-size: 7em" />
                    </div>
                    <router-link to="/" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            style="width: 95%">Cerrar Sesión </q-btn>
                    </router-link>
                    <router-link to="/home" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            style="width: 95%">Menu </q-btn>
                    </router-link>
                    <q-linear-progress :value="progress" class="q-mt-md" />

                    <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Presupuesto" style="width: 95%;margin-top: 8%;">
                        <q-menu>
                            <q-list style="min-width: 100px">
                                <router-link to="/Presupuesto" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Presupuesto" style="width: 95%" />
                    </router-link>
                                <router-link to="/Presupuesto" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Presupuesto" style="width: 95%" />
                    </router-link>
                            </q-list>
                        </q-menu>
                    </q-btn>

                    <router-link to="/Fichas" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send" label="Fichas"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/Lotes" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send" label="Lotes"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/Areas" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send" label="Areas"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/Pedidos" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send" label="Pedido"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/Productos" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Producto" style="width: 95%" />
                    </router-link>
                     <q-linear-progress :value="progress" class="q-mt-md" /> 

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

.opcionescont {
    font-size: large;

}
</style>
