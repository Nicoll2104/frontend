<template>
  <q-card-section
    class="q-gutter-md row items-center justify-center aling tarjetascont"
  >
    <router-link
      v-for="(item, index) in content[rol]"
      :key="index"
      :to="item.ruta"
      class="link-card"
    >
      <q-btn
        color="accent"
        class="tarjetasbtn text-weight-bold text-h6 justify-center"
      >
        <span class="tarjetastxt text-black">{{ item.titulo }}</span>

        <div class="card__content" :class="item.titulo + 'btn'">
          <img
            :src="item.img"
            alt=""
            :class="item.titulo + 'img'"
            class="img"
          />
        </div>
      </q-btn>
    </router-link>
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

<style>
* {
  text-decoration: none;
}
.tarjetascont {
  min-height: 50vh;
}

.img {
  margin: 10px;
  height: 150px;
}

.tarjetasbtn {
  margin: 15px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.144);
  width: 70vw !important;
  max-width: 400px;
}

.tarjetastxt {
  width: 50%;
}

</style>
