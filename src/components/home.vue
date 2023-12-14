<template>

  <q-card-section class="q-gutter-md row items-center justify-center aling tarjetascont">


      <router-link v-for="(item, index) in content" :key="index" :to="item.ruta" class="link-card">
        <q-btn color="secondary" class="tarjetasbtn text-weight-bold text-h6 justify-center">
          {{ item.titulo }}
          <div class="tools">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>

          <div class="card__content" :class="item.titulo +'btn'">

            <img :src="item.img" alt="" :class="item.titulo +'img'" class="img" />
          </div>
        </q-btn>
      </router-link>

  </q-card-section>
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

*{
  text-decoration: none;
}
.tarjetascont{
  min-height: 60vh;
}

.img {
  margin: 10px;
  height: 150px;
}

.link-card {
}


.tarjetasbtn {
  margin: 15px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.144);
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

</style>

