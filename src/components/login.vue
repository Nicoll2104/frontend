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
  <div class="cont flex flex-center fullscreen">
    <div class="olascont"></div>
    <q-card class="my-card custom-card-size q-pa-md">
      <q-card-section class="q-py-none">
        <p class="text-h3 text-dark text-bold bienvenido-verde">Bienvenido</p>
        <p>Por favor ingrese sus datos de usuario para continuar a la página</p>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="data.correo"
          placeholder="Correo electrónico"
          class="input q-my-md correo"
          outlined
        />
        <q-input
          v-model="data.contrasena"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Contraseña"
          class="input q-my-md contraseña"
          outlined
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
        <router-link to="/Restablecimiento">
          <div class="text-body1 text-accent text-weight-bold contrasenaayuda">¿Olvidaste tu contraseña?</div>
        </router-link>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-btn push label="Ingresar" class="full-width-btn" @click="validarCampos" :loading="loading" />
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
@use '../quasar-variables.scss' as *;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Asegura que el padding no aumente el tamaño total del elemento */
}

.cont {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.my-card {
  background: rgb(255, 255, 255);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90vw;
}

.custom-card-size {
  width: 350px;
  height: auto; /* Change to auto to adjust height based on content */
}

.bienvenido-verde {
  color: #4CAF50 !important;
  margin-bottom: 10px; /* Reducir el margen inferior */
}

.correo,
.contraseña {
  width: 100%;
  margin: 10px 0;
}

.q-input__control {
  border: 1px solid #4CAF50 !important;
  border-radius: 5px;
}

.q-btn.full-width-btn {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.q-card-section {
  padding: 5px 0; /* Reducir el padding para reducir los espacios entre secciones */
}

.q-card-section.q-pt-none {
  padding-top: 0 !important; /* Remove top padding for the button section */
}

.contrasenaayuda {
  color: #4CAF50 !important;
  text-decoration: none;
  margin: 10px 0; /* Espacio para separar del campo de contraseña */
}

.contrasenaayuda:hover {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}

.olascont {
  background: url('../assets/fondo5.png') no-repeat center fixed;
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

@media (max-width: 1200px) {
  .olascont {
    background-size: cover;
  }
}

@media (max-width: 768px) {
  .olascont {
    background-size: cover;
  }
}

@media (max-width: 480px) {
  .olascont {
    background-size: cover;
  }
}
</style>


