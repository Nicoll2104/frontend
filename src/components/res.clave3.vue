<script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'
  import { useRouter } from "vue-router";
  import { useUsuarioStore } from "../stores/usuario.js"
  import Cookies from 'js-cookie'

  const UsuarioStore = useUsuarioStore()
  const router = useRouter()

  const data = ref({
    contrasena: "",
  });

  const $q = useQuasar();
  let errorMessage = ref("");

  const showDefault = () => {
    notification = $q.notify({
      spinner: true,
      message: 'Please wait...',
      timeout: 0
    });
  };

  
  function validarCampos() {
  const arrData = Object.entries(data.value)
  for (const d of arrData) {
    if (d[1] === null) {
      notificar('negative', 'Por favor complete todos los campos')
      return
    }
    if(typeof d[1] === 'string'){
      if (d[1].trim() === "") {
        notificar('negative','Por favor complete todos los campos')
        return
      }
    }
  }

  contrasena()
}

  let validacion = ref(false);
  let notification = ref(null);
  let loading = ref(false)

  function cambiar() {
    const arrData = Object.entries(data.value)
    console.log(arrData);
    for (const d of arrData) {
      console.log(d);
      if (d[1] === null) {
        notificar('negative', 'Por favor complete todos los campos')
        return
      }
      if(typeof d[1] === 'string'){if (d[1].trim() === "") {
        console.log("h");
        notificar('negative','Por favor complete todos los campos')
        return
      }}
    }



    restablecerContrasena()
  }

  async function contrasena() {
    try {
      console.log("Esperando confirmación...");
      loading.value = true;
      const response = await UsuarioStore.nuevacontrasena({correo: Cookies.get('correo'), codigo: Cookies.get('codigo'), contrasena: data.value.contrasena});
      console.log(response);

      if(!response) return

      if (response.status != 200) {
        notificar('negative', response.mensaje)
        return;
      }
      notificar('positive', 'Cambio hecho')
      router.push("/");
    } catch (error) {
      console.log(error);
  }
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}
    </script>


<template>
    <div class="cont bg-dark flex flex-center fullscreen">
    <div class="olascont">
      <img class="olaazul" src="../assets/olaazul.svg">
      <img class="olaverde" src="../assets/olaverde.svg">
    </div>
      <q-card class="my-card q-ma-lg q-px-md q-py-lg" >
        <q-card-section class="q-py-none">
          <p class="text-h3 text-primary text-bold">Restablecer Contraseña</p>
          <q-div class="subtittle text-primary"> Por favor digite su correo y asigne una nueva contraseña</q-div>
        </q-card-section>
        <q-card-section>
          <q-input inputstandout="bg-accent" v-model="data.contrasena" label="contraseña" type="password" 
          class=" input"/>
        </q-card-section>


        <q-card-section>
          <q-btn push color="secondary" label="guardar" class="float-right" @click="validarCampos" :loading="loading"/>
        </q-card-section>
      </q-card>
  </div>
</template>

<style lang="scss" scoped>
@use '../quasar-variables.scss' as *;
  
  * {
    margin: 0;
    padding: 0;
  }

  .my-card{
    transform: translate(0px, -50px);
}

.olascont {
    flex: 1;
}
.olascont {
    user-select: none;
    z-index: -1;
    Overflow: hidden;
    position: fixed;
    height: 100vh;
    width: 100vw;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 0);
}

@media only screen and (min-width: 1200px) {
    .olascont{
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