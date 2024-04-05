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

const data = ref({
  correo: "",
  contrasena: "",
});

const usuario = UsuarioStore.sesion.usuarios
console.log(usuario)

  
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
    <div class="cont bg-dark flex flex-center ">

        <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo_presupuestal" label="Codigo presupuestal" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el codigo presupuestal']"></q-input>
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.presupuesto_inicial" label="Presupuesto inicial" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el presupuesto inicial']"></q-input>
          <q-input class="input1" outlined v-model="data.año" label="Año" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el año']"></q-input>
          <q-input class="input1" outlined v-model="data.modificaciones" label="Modificaciones" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese las modificaciones']"></q-input>
          <q-input class="input1" outlined v-model="data.presupuesto_definitivo" label="Presupuesto definitivo"
            type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el presupuesto definitivo']"></q-input>
          <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0;">
            <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
              <q-icon name="cancel" color="white" right />
            </q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
        
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

                    <q-card-section>
                    </q-card-section>
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