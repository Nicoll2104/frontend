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
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
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
       <!--  <img class="olaazul" src="../assets/olaazul.svg"> -->
        <!-- <img class="olaverde" src="../assets/olaverde.svg"> -->
      </div>
      <q-card class="my-card q-ma-lg q-px-lg q-py-xl">
        <q-card-section class="q-py-none">
          <p class="text-h2 text-white text-bold ">Bienvenido</p>
          <q-div class="text-h5 text-white">Por favor ingrese sus datos de usuario para continuar a la pagina</q-div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="data.correo" label="Correo electrónico" 
          color="white" label-color="white" 
          class="input input q-my-md" outlined dark  />
          
          <q-input
            v-model="data.contrasena"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            color="white"
            label-color="white"
            class="input q-my-md" outlined dark 
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                @click="togglePasswordVisibility"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <router-link to="/Restableciemiento">
            <div class="text-body1 text-accent text-weight-bold contrasenaayuda">¿Olvidaste tu contraseña?</div>
          </router-link>
        </q-card-section>
        <q-card-section>
          <q-btn push color="secondary" label="Ingresar"  class="float-right" 
          @click="validarCampos" :loading="loading" size="17px" />
        </q-card-section>
      </q-card>
    </div>
  </template>
    
    <!-- scoped sirve para evitar que los estilos afecte a los
    demas componentes  -->

    <!-- lang="scss" es para poder utilizar variables sass con "$"-->

<style lang="scss" scoped>
@use '../quasar-variables.scss' as *;


* {
    margin: 0, 0 , 0, 0 ;
    padding: 0;
}


.my-card {
  border-radius: 2%;
  border: 3px solid #000000;
  background-color: rgba(0, 0, 0, 0.125);
  backdrop-filter: blur(0.1rem) ;
}

.olascont {
  background: url('../assets/fondo5.png') 
  no-repeat center fixed;
  background-size: cover;
  flex: 1;
  user-select: none;
  z-index: -1;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

/* Media queries for responsiveness */
@media (max-width: 1200px) {
  .olascont {
    background-size: cover; /* Ensures the image covers the background in larger screens */
  }
}

@media (max-width: 768px) {
  .olascont {
    background-size: cover; /* Ensures the image covers the background in tablets */
  }
}

@media (max-width: 480px) {
  .olascont {
    background-size: cover; /* Ensures the image covers the background in mobile phones */
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

.contrasenaayuda{
  transition: ease 0.3s;
  width: fit-content;
}

.contrasenaayuda:hover{
    //color: $secondary !important;
    transform: scale(1.2) translate(10%, 0);
}

.cursor-pointer {
  cursor: pointer;
}

</style>