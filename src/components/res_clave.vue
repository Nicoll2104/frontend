<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUsuarioStore } from "../stores/usuario.js";
import Cookies from "js-cookie";
import Codigo from './res_clave2.vue';

const UsuarioStore = useUsuarioStore();
const router = useRouter();

const data = ref({
  correo: "",
});

const $q = useQuasar();
let errorMessage = ref("");

const showDefault = () => {
  notification = $q.notify({
    spinner: true,
    message: "Please wait...",
    timeout: 0,
  });
};

function validarCampos() {
  const arrData = Object.entries(data.value);
  for (const d of arrData) {
    if (d[1] === null) {
      notificar("negative", "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
    }
  }

  restablecerContrasena()
}

let validacion = ref(false);
let notification = ref(null);
let loading = ref(false);

function cambiar() {
  const arrData = Object.entries(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar("negative", "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        console.log("h");
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
    }
  }

  restablecerContrasena();
}
const siguiente = ref(false)

async function restablecerContrasena() {
  try {
    console.log("Esperando confirmación...");
    loading.value = true;
    const response = await UsuarioStore.recuperar(data.value.correo);
    console.log(response);

    if (!response) return;

    if (response.status != 200) {
      notificar("negative", response.mensaje);
      return;
    }
    Cookies.set('correo', data.value.correo, {expires: 1})
    siguiente.value = true
  } catch (error) {
    console.log(error);
  }
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

</script>

<template>
  <div>
    <div class="cont bg-dark flex flex-center fullscreen" v-if="!siguiente">
      <div class="olascont">
        <img class="olaazul" src="../assets/olaazul.svg" />
        <img class="olaverde" src="../assets/olaverde.svg" />
      </div>
      <q-card class="my-card q-ma-lg q-px-md q-py-lg">
        <q-card-section class="q-py-none">
          <p class="text-h3 text-primary text-bold">Restablecer Contraseña</p>
          <q-div class="subtittle text-primary">
            Por favor digite su correo y asigne una nueva contraseña</q-div
          >
        </q-card-section>
        <q-card-section>
          <q-input
            inputstandout="bg-accent "
            v-model="data.correo"
            label="Correo electronico"
            class="q-mb-lg input"
          />
        </q-card-section>
  
        <q-card-section>
          <q-btn
            push
            color="secondary"
            label="guardar"
            class="float-right"
            @click="validarCampos"
            :loading="loading"
          />
        </q-card-section>
      </q-card>
    </div>
    <Codigo v-if="siguiente"></Codigo>

  </div>
</template>

<style lang="scss" scoped>
@use "../quasar-variables.scss" as *;

* {
  margin: 0;
  padding: 0;
}

.my-card {
  transform: translate(0px, -50px);
}

.olascont {
  flex: 1;
}
.olascont {
  user-select: none;
  z-index: -1;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  width: 100vw;
  bottom: 0;
  right: 50%;
  transform: translate(50%, 0);
}

@media only screen and (min-width: 1200px) {
  .olascont {
    bottom: -2vw;
  }
}

.olaverde,
.olaazul {
  position: absolute;
  width: 100vw;
  min-width: 980px;
  bottom: 0;
  right: 50%;
  transform: translate(50%, 0);
}
</style>
