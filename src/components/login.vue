<template>
    <div class="cont">
        <div class="olascont">
            <img class="olaazul" src="../assets/olaazul.svg">
            <img class="olaverde" src="../assets/olaverde.svg">
        </div>
        <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" >
                <q-card-section>
                    <q-div class="text-h3">Bienvenido</q-div>
                    <p class="subtittle">Por favor ingrese sus datos de usuario para continuar:</p>
                </q-card-section>
                <q-card-section style="max-width: 500px">
                    <q-input standout v-model="name" label="Nombre de usuario" />
                </q-card-section>
                <q-card-section style="max-width: 500px">
                    <q-input standout v-model="password" label="Contraseña" />
                    <router-link to="/Restableciemiento" class="ingresarcont">
                        <button class="contrasenaayuda">¿Olvidaste tu contraseña?</button>
                    </router-link>
                </q-card-section>
                    <q-card-section style="max-width: 500px">
                        <router-link to="/home" class="ingresarcont">
                        <q-btn push color="primary" label="Ingresar" />
                    </router-link>
                    </q-card-section>
            </q-card>
        </div>
    </div>
</template>
  <!-- <script setup>
  import { ref } from "vue";
  import { useLoginStore } from "../stores/login.js"
  import { useQuasar } from 'quasar'
  const loginStore = useLoginStore()
  
  const username = ref('');
  const password = ref('');
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
  async function validar() {
      if (!username.value && !password.value) {
          errorMessage.value = "* Ingrese el usuario y la contraseña"
      }else if(!username.value){
          errorMessage.value = "* Ingrese el usuario"
      }else if(!password.value){
          errorMessage.value = "* Ingrese la contraseña"
      }else{
          errorMessage.value =""
          validacion.value = true;
  };
      if (validacion.value==true) {
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
        
        validacion.value = false  
    };
    </script> -->
    
    <!-- scoped sirve para evitar que los estilos afecte a los
    demas componentes  -->
<style scoped>
.paleta {
    background-color:
        #3F497F #29A19C #A3F7BF;
}

* {
    margin: 0;
    padding: 0;
}
.my-card{
    background-color: accent;
    transform: translate(0px, -50px);
}

.cont {
    display: flex;
    justify-content: center;
    height: 100vh;
    align-items: center;
}

.olascont {
    flex: 1;
}
.subtittle {
    font-size: 20px;
    font-weight: bold;
    color: #3F497F;
    margin-bottom: 10px;
}


input::placeholder {
    color: rgb(255, 255, 255);
}


.contrasenaayuda {
    text-align: right;
    color: #29A19C;
    font-weight: 700;
    text-decoration-line: underline;
    margin: 10px 0px;
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


.contrasenaayuda {
    background-color: transparent;
    border: none;
    color: #29A19C;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
}

.contrasenaayuda:hover {
    color: #3F497F;
}
</style>