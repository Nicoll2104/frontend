<script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'
  import { useRouter } from "vue-router";
  import { useUsuarioStore } from "../stores/usuario.js"
  import Cookies from 'js-cookie'


  const UsuarioStore = useUsuarioStore()
  const router = useRouter()
  
const data = ref({
  correo: "",
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
  
  let validacion = ref(false);
  let notification = ref(null);
  let loading = ref(false)



  function validarCampos() {
  const arrData = Object.entries(data.value)
  for (const d of arrData) {
    if (d[1] === null) {
      notificar('negative', 'Por favor complete todos los campos')
      return
    }
    if(typeof d[1] === 'string'){if (d[1].trim() === "") {
      notificar('negative','Por favor complete todos los campos')
      return
    }}
  }

  validarIngreso()
}

async function validarIngreso() {
  try {
    console.log("Esperando confirmación...");
    loading.value = true;
    const response = await UsuarioStore.login(data.value);
    console.log(response);
  
    if(!response) return
    
    if (response.status != 200) {
      notificar('negative', response.mensaje)
      return;
    }
    notificar('positive', 'Sección exitosa')
    // Enviar la respuesta del servidor como parámetros de la URL al redirigir a la página de inicio
    router.push({ path: '/inicio'});
  } catch (error) {
    
  }finally{
    loading.value = false
  }
}




/*       if (validacion.value==true) {
          try {
            showDefault()
            const res = await loginStore.Login({
                cuenta: username.value,
                clave: password.value
            });
            console.log(res);
            localStorage.setItem('token', res.data.token)
            if(notification) {
                notification()
            }
            $q.notify({
                spinner: false, 
                message: "Ingresado al programa", 
                timeout: 2000,
                type: 'positive',
            });
        } catch (error) {
            if(notification) {
                notification()
            };
            $q.notify({
                spinner: false, 
                message: `${error.response.data.msg}`, 
                timeout: 2000,
                type: 'negative',
            });
        };
        }
        
        validacion.value = false   */




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
                    <p class="text-h3 text-primary text-bold">Perfil</p>
                    <q-div class="subtittle text-primary"> when haces tus momazos mientras pregramas tu pajina wep</q-div>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="data.correo" label="but"
                    class="q-mb-lg input"/>
                    <q-input  v-model="data.contrasena" label="te terminan hakeando" type="" 
                    class=" input"/>
                </q-card-section>

                <q-card-section>
                    <router-link to="/Restableciemiento">
                        <span class="text-secondary text-weight-bold contrasenaayuda">ohhh!!! mi base de datos🗣️🔥💯</span>
                    </router-link>

                    <q-card-section>
                    </q-card-section>
                    <q-btn push color="secondary" label="Ingresar" class="float-right" @click="validarCampos" :loading="loading"/>
                </q-card-section>

                        

            </q-card>
        </div>
</template>
    
    <!-- scoped sirve para evitar que los estilos afecte a los
    demas componentes  -->

    <!-- lang="scss" es para poder utilizar variables sass-->

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

.contrasenaayuda:hover{
    color: $primary !important;
}

</style>