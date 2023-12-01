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
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
                        </q-avatar>
                        Title
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-secondary" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated>
                <div class="q-pa-md q-gutter">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 3em">
                        <q-avatar color="white" text-color="primary" padding="none" icon="face" style="font-size: 7em" />
                    </div>
                    <router-link to="/" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            style="width: 95%">Cerrar Sesión </q-btn>
                    </router-link>
                    <router-link to="/home" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            style="width: 95%">Cambiar nombre </q-btn>
                    </router-link>
                    <q-linear-progress :value="progress" class="q-mt-md" color="primary" />
                    <router-link to="/Presupuesto" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Presupuesto" style="width: 95%" />
                    </router-link>
                    <router-link to="/inventario" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Inventarios" style="width: 95%" />
                    </router-link>
                    <router-link to="/pedidos" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send" label="Pedidos"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/informes_sistema" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Informes del sistema" style="width: 95%" />
                    </router-link>
                    <router-link to="/utilidades_sistema" class="opcioncont" style="font-size: 2em">
                        <q-btn no-caps align="between" color="accent" text-color="primary" icon-right="send"
                            label="Utilidades del sistema" style="width: 95%" />
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
.padre {
    display: flex;
    flex-wrap: wrap;
    gap: 65px;
    padding: 2%;
}

.card {
    box-sizing: border-box;
    width: 240px;
    height: 254px;
    background: white;
    box-shadow: 2px 7px 11px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    user-select: none;
    font-weight: bolder;
    color: black;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
</style>
