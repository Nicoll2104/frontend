<template>
  <q-card-section
    class="q-gutter-md row items-center justify-center aling tarjetascont"
  >
    <q-card
      v-for="(item, index) in content[rol]"
      :key="index"
      flat
      bordered
      class="custom-card cursor-pointer"
      @click="$router.push(item.ruta)"
    >
      <q-card-section class="bg-green-4 text-white imgcont">
        <div class="row items-center justify-center">
          <img :src="item.img" alt="" class="img" />
        </div>
      </q-card-section>
      <q-card-section class="text-center text-weight-bold text-h6">
        {{ item.titulo }}
      </q-card-section>
    </q-card>
  </q-card-section>
</template>

<script setup>
import { ref } from "vue";
import presupuesto from "../assets/presupuesto.png";
import fichas2 from "../assets/fichas2.png";
import lotes from "../assets/lotes.png";
import areas from "../assets/areas.png";
import pedido from "../assets/pedido.png";
import producto from "../assets/producto.png";
import usuario from "../assets/usuario.png";
import contrato from "../assets/contrato.png";
import { Cookies } from "quasar";

const rol = Cookies.get('rol')
let content = ref({
  Administrador: [
    { ruta: "/Dependencias", titulo: "Dependencias", img: presupuesto },
    { ruta: "/Destino", titulo: "Destino", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Area tematica", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },
    { ruta: "/Usuario", titulo: "Usuarios", img: usuario },
    { ruta: "/Contrato", titulo: "Contrato", img: contrato },
  ],
  Instructor: [
  { ruta: "/Dependencias", titulo: "Dependencias", img: presupuesto },
    { ruta: "/Destino", titulo: "Destino", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Areas", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },

  ],
  Bodega: [
  { ruta: "/Dependencias", titulo: "Dependencias", img: presupuesto },
    { ruta: "/Destino", titulo: "Destino", img: fichas2 },
    { ruta: "/Lotes", titulo: "Lotes", img: lotes },
    { ruta: "/Areas", titulo: "Areas", img: areas },
    { ruta: "/Pedidos", titulo: "Pedido", img: pedido },
    { ruta: "/Productos", titulo: "Producto", img: producto },
    { ruta: "/Compras", titulo: "Compras", img: presupuesto },
    { ruta: "/Contrato", titulo: "Contrato", img: contrato },
  ],
});
</script>

<style lang="scss">
@use '../quasar-variables.scss' as *;

* {
  text-decoration: none;
}
.tarjetascont {
  min-height: 50vh;
}

.imgcont{
  transition: ease 0.5s;
  perspective: 150px;
}

.custom-card:hover .imgcont{
    transform: rotateX(20deg) rotateY(180deg);
    background-color: rgb(213, 213, 213) !important;
  }

.img {
  margin: 10px;
  height: 150px;
}



.tarjetastxt {
  width: 50%;
}
.custom-card {
  width: 100%; 
}

@media (min-width: 600px) {
  .custom-card {
    width: 35%; 
  }
}

@media (min-width: 900px) {
  .custom-card {
    width: 20%; 
  }
}

</style>
