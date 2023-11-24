<template>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <p class="nombreLogo">TrasporteEDG</p>
  
          <q-toolbar-title>
            <q-avatar> </q-avatar>
  
            <div @click="cerrarSesion">
              <router-link to="/"
                ><img
                  src="https://cdn-icons-png.flaticon.com/128/1176/1176434.png"
                  style="height: 35px; width: 35px"
              /></router-link>
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <div class="perfil">
          <img
            src="https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg"
            style="height: 180px; width: 180px"
          />
        </div>
  
        <div class="botoneslate">
          <button class="btn">
            <router-link to="/home"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/6281/6281275.png"
                style="height: 30px; width: 30px"
              />
              Home
            </router-link>
          </button>
          <button class="btn">
            <router-link to="/conductor"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/1480/1480682.png"
                style="height: 30px; width: 30px"
              />Conductores</router-link
            >
          </button>
          <button class="btn">
            <router-link to="/vendedor"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/73/73199.png"
                style="height: 30px; width: 30px"
              />Vendedores</router-link
            >
          </button>
          <button class="btn">
            <router-link to="/bus"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/0/308.png"
                style="height: 30px; width: 30px"
              />Buses</router-link
            >
          </button>
          <button class="btn">
            <router-link to="/clientes"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/3126/3126647.png"
                style="height: 30px; width: 30px"
              />Clientes</router-link
            >
          </button>
          <button class="btn">
            <router-link to="/ruta"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/3419/3419596.png"
                style="height: 30px; width: 30px"
              />Rutas</router-link
            >
          </button>
  
          <button class="btn">
            <router-link to="/ventas"
              ><img
                src="https://cdn-icons-png.flaticon.com/128/7160/7160625.png"
                style="height: 30px; width: 30px"
              />Ventas</router-link
            >
          </button>
  
          <button class="btn">
            <router-link to="/boleto"
              ><img
                src="https://t3.ftcdn.net/jpg/06/41/84/02/240_F_641840207_Q30aIf0Aa8h9pIeTCRpFx1CN6kT6f9u3.jpg"
                style="height: 30px; width: 30px"
              />Tiquetes</router-link
            >
          </button>
        </div>
      </q-drawer>
  
      <q-page-container>
        <router-view />
      </q-page-container>
  
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar> </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    setup() {
      const leftDrawerOpen = ref(false);
  
      return {
        leftDrawerOpen,
        toggleLeftDrawer() {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        },
        cerrarSesion() {
          console.log("Cerrando sesión...");
          localStorage.removeItem("token");
          localStorage.removeItem("vendedor");
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .perfil {
    display: flex;
    justify-content: center;
  }
  .nombreLogo {
    position: relative;
    top: 9px;
    color: transparent;
    font-size: 20px;
  }
  
  .botoneslate {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .botoneslate a {
    text-decoration: none;
    color: #1976d2;
    display: flex;
    gap: 35px;
  }
  .btn {
    height: 80px;
    border: none;
    background-color: transparent;
    font-size: 20px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bolder;
    width: 100%;
    align-items: center;
    display: flex;
  }
  
  .btn:hover {
    background-color: aliceblue;
  }
  
  h1 {
    font-size: 25px;
  }
  
  .q-toolbar__title {
    display: flex;
    font-size: 21px;
    font-weight: normal;
    letter-spacing: 0.01em;
    justify-content: space-between;
    align-items: center;
  }
  
  .q-toolbar {
    position: relative;
    padding: 12px;
    min-height: 50px;
    width: 100%;
  }
  </style>
  