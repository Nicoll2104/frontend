<template>
  <div class="cont flex flex-center fullscreen">

    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Editar perfil</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.cedula" label="Cedula" type="number" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la cedula']"></q-input>
          <q-input class="input1" outlined v-model="data.correo" label="Correo" type="text" maxlength="30"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el correo']"></q-input>
          <q-input class="input1" outlined v-model="data.telefono" label="Telefono" type="number" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el telefono']"></q-input>
          <q-input class="input1" outlined v-model="data.contrasena" label="Contraseña" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la contraseña']"></q-input>
          <q-input class="input1" outlined v-model="data.rol" label="Rol" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el rol']"></q-input>
          <q-btn @click="validarCampos" :loading="loading" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" label="Actualizar perfil">
            <q-icon name="edit" color="white" right />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h3 text-green text-bold perfil">Perfil</div>

        </q-card-section>
        <q-card-section class="col-5 flex flex-center imagen">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
        </q-card-section>
      </q-card-section>
      
   


      <q-card-section>
        <p class="subtittle q-my-md text-positive text-left"><strong>Nombre:</strong><span class="nombre-color"></span> {{ usuario.nombre }}</p>
        <p class="subtittle q-my-md text-positive text-left"><strong>Correo:</strong> {{ usuario.correo }}</p>
        <p class="subtittle q-my-md text-positive text-left"><strong>Rol:</strong> {{ usuario.rol }}</p>
        <p class="subtittle q-my-md text-positive text-left"><strong>Teléfono:</strong> {{ usuario.telefono }}</p>
        <p class="subtittle q-my-md text-positive text-left"><strong>Estado:</strong> {{ usuario.status == 1 ? 'Activo' : 'Inactivo' }}</p>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn push color="warning" label="Editar el perfil" class="text-capitalize q-mx-md" @click="editar()" :loading="loading" icon="edit" />
        <router-link to="/inicio">
          <q-btn push color="positive" label="Volver al menú" class="text-capitalize q-mx-md" :loading="loading" icon="home" />
        </router-link>
      </q-card-actions>
    </q-card>
  </div>
</template>

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

const usuario = ref(UsuarioStore.sesion.usuarios || {usuarios:{
    "_id":'',
    "nombre":'',
    "cedula":'',
    "correo":'',
    "telefono":'',
    "contrasena":'',
    "rol":''
  }})

const data = ref(UsuarioStore.sesion.usuarios);

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
    const response = await useUsuario.putUsuario(usuario._id, data.value);
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
    notificar('negative', 'Error al actualizar el perfil')
  } finally {
    loading.value = false
    UsuarioStore.sesion.usuarios = data
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

<style lang="scss" scoped>
@use '../quasar-variables.scss' as *;

.cont {
  z-index: 1;
}

.olascont {
  display: hidden;
  flex: 1;
}

.olascont {
  user-select: none;
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



.contrasenaayuda:hover {
  color: $positive !important;
}
.perfil{
  margin-top: 30px;
}
.imagen{
  width: 200px !important; 
  height: 110px !important;
 
}

</style>
