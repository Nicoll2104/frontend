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
                    <q-btn  dense flat round icon="menu" @click="toggleLeftDrawer" />
                    <q-toolbar-title>                        Distribucion De Presupuesto SENA
                    </q-toolbar-title>
                    <router-link to="/">
    <q-btn  dense flat round icon="exit_to_app" color="white" />
  </router-link>
                </q-toolbar>
            </q-header>

            <q-drawer class="bg-secondary" v-model="leftDrawerOpen" side="left" behavior="mobile" elevated>
                <div class="q-pa-md q-gutter opcionescont">
                    <div class="q-pa-md q-gutter-sm" style="margin-top: 1em">
                        <q-avatar color="white" text-color="primary" padding="none" icon="face" style="font-size: 7em"/>
                    </div>
                    <router-link to="/"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            style="width: 95%">Cerrar Sesión </q-btn>
                    </router-link>
                    <router-link to="/home"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            style="width: 95%">Menu</q-btn>
                    </router-link>
                    
                    <q-linear-progress :value="progress"  color="primary" class="linea"/>
                    
                    <router-link to="/Presupuesto"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            label="Presupuesto" style="width: 95%" />
                    </router-link>
                    <router-link to="/Fichas"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            label="Fichas" style="width: 95%" />
                    </router-link>
                    <router-link to="/Lotes"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right" label="Lotes"
                            style="width: 95%" />
                    </router-link>
                    <router-link to="/Areas"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            label="Areas" style="width: 95%" />
                    </router-link>
                    <router-link to="/Pedidos"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            label="Pedido" style="width: 95%" />
                    </router-link>
                    <router-link to="/Productos"  >
                        <q-btn class="opcion" no-caps align="between" color="accent" text-color="primary" icon-right="chevron_right"
                            label="Producto" style="width: 95%" />
                    </router-link>
                    <q-linear-progress :value="progress" class="linea" />

                </div>
            </q-drawer>

            <q-page-container>
                <router-view />
            </q-page-container>

        </q-layout>
    </div>
</template>

<style scoped>

*{
    font-size: large;
    text-align: center;
}



.opcion{

    margin: 8px;
    font-size: 16px;
    font-weight: bold;
    transition: ease 0.3s;
}

.linea{
    margin: 15px auto;
    width: 250px;
}
</style>
