<script setup>
  import { ref } from "vue";
  import { useQuasar } from 'quasar'
  import { useRouter } from "vue-router";
  import { useUsuarioStore } from "../stores/usuario.js"
  import Cookies from 'js-cookie'

const $q = useQuasar();
const UsuarioStore = useUsuarioStore()
const router = useRouter()
const modal = ref(false);
let loading = ref(false)  

const data = ref(UsuarioStore.sesion.usuarios);


const usuario = ref(UsuarioStore.sesion.usuarios || {usuarios:{
    "id":'',
    "nombre":'',
    "cedula":'',
    "correo":'',
    "telefono":'',
    "contrasena":'',
    "rol":''
  }})

console.log(usuario.value)

  
function editar() {
    modal.value = true
  }



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

        <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title> editar perfil</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.cedula" label="Cedula" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese la cedula']"></q-input>
          <q-input class="input1" outlined v-model="data.correo" label="Correo" type="text" maxlength="30" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el correo']"></q-input>
          <q-input class="input1" outlined v-model="data.telefono" label="Telefono" type="number" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el telefono']"></q-input>
          <q-input class="input1" outlined v-model="data.contrasena" label="Contraseña" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la contraseña']"></q-input>
          <q-input class="input1" outlined v-model="data.rol" label="rol" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la rol']"></q-input>
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" label="actualizar perfil">
            <q-icon name="edit" color="white" right />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
        
        <div class="olascont">
            <img class="olaazul" src="../assets/olaazul.svg">
            <img class="olaverde" src="../assets/olaverde.svg">
        </div>


        
            <q-card class="my-card q-ma-md q-px-md q-py-lg " >
                <q-card-section class="q-py-none">
                    <p class="text-h3 text-primary text-bold">Perfil</p>
                    <q-div class="subtittle text-primary"></q-div>
                </q-card-section>
                <q-card-section>
                  <p class="subtittle q-my-md text-primary text-left"> Nombre: {{ usuario.nombre }}</p>
                  <p class="subtittle q-my-md text-primary text-left"> Correo: {{ usuario.correo }}</p>
                  <p class="subtittle q-my-md text-primary text-left"> Rol: {{ usuario.rol }}</p>
                  <p class="subtittle q-my-md text-primary text-left"> Telefono: {{ usuario.telefono }}</p>
                  <p class="subtittle q-my-md text-primary text-left"> Estado: {{ usuario.status == 1 ? 'Activo' : 'Inactivo' }}</p>
                </q-card-section>

                <q-card-section>
                    <q-btn push color="warning" label="editar el perfil" class="text-capitalize q-mx-md" @click="editar()" :loading="loading"
                    icon="edit"/>
                    <router-link to="/Restableciemiento">
                    <q-btn push color="primary" label="volver al menú" class="text-capitalize q-mx-md" :loading="loading"
                    icon="home"/>
                    </router-link>
                </q-card-section>
            </q-card>

            
        </div>
</template>
    
    <!-- scoped sirve para evitar que los estilos afecte a los
    demas componentes  -->

    <!-- lang="scss" es para poder utilizar variables sass-->

<style lang="scss" scoped>
@use '../quasar-variables.scss' as *;


.olascont {
    flex: 1;
}
.olascont {
    user-select: none;

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