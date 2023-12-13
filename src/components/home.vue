<template>
  <div class="container">
    <div class="contenedor2" v-for="(item, index) in content" :key="index">
      <router-link :to="item.ruta" class="link-card">
        <div class="card">
          <div class="tools">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>

          <div class="card__content">
            {{ item.titulo }}
            <img :src="item.img" alt="" class="img" />
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let content = ref([
  { ruta: "/Presupuesto", titulo: "Presupuesto", img: "src/assets/presupuesto.png" },
  { ruta: "/Fichas", titulo: "Fichas", img: "src/assets/fichas2.png" },
  { ruta: "/Lotes", titulo: "Lotes", img: "src/assets/lotes.png" },
  { ruta: "/Areas", titulo: "Areas", img: "src/assets/areas.png" },
  { ruta: "/Pedidos", titulo: "Pedido", img: "src/assets/pedido.png" },
  { ruta: "/Productos", titulo: "Producto", img: "src/assets/producto.png" },
]);
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  height: 75vh;
  width: 100%;
  justify-content: center;
  gap: 40px;
}

.contenedor2 {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  height: 290px;
  margin: 5px 15px;
}

.contenedor2 a {
  text-decoration: none;
  color: #0d0d0d;
  gap: 30px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 2em;
  border-radius: 50px;
}

.img {
  height: 150px;
  width: 150px;
  border: #A3F7BF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.link-card {
  width: 257px;
  height: 290px;
}

.card {
  width: 257px;
  height: 290px;
  margin: 0 auto;
  background-color: #A3F7BF;
  border-radius: 8px;
  z-index: 1;
  box-shadow: 5px 5px 10px -5px rgba(0, 0, 0, 0.77);
}

.card:hover {
  background-color: #F2F7FF;
  transition: background-color 0.3s ease;
}

.tools {
  display: flex;
  align-items: center;
  padding: 5px;
}

.line {
  width: 30px;
  height: 3px;
  background-color: #29A19C;
  margin: 5px;
}

.card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Roboto Slab", serif;
}
</style>

