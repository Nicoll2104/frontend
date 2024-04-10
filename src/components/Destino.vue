<script setup>
import { onMounted, ref } from "vue";
import { useDestinoStore } from "../stores/destino.js";
import { useQuasar } from 'quasar'

const modelo = "Destino (Fichas/Proyectos)";
const useDestino = useDestinoStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "codigo",
    label: "Codigo",
    align: "left",
    field: (row) => row.codigo,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,

  },
  {
    name: "año",
    label: "inico",
    align: "left",
    field: (row) => row.fecha_inicio.slice(0, -14),
  },
  {
    name: "año",
    label: "fin",
    align: "left",
    field: (row) => row.fecha_fin.slice(0, -14),
  },
  {
    name: "año",
    label: "nivel de formacion",
    align: "left",
    field: (row) => row.nivel_de_formacion,
  },
  {
    name: "status",
    label: "Estado",
    align: "center",
    field: (row) => row.status,
  },
  {
    name: "opciones",
    label: "Opciones",
    field: "opciones",
  },
]);
const rows = ref([]);

const data = ref({
  codigo: "",
  nombre: "",
  fecha_inicio: "",
  fecha_fin: "",
  nivel_de_formacion: "",
});

const obtenerInfo = async () => {
  try {
    const res = await useDestino.obtenerInfoDestinos();
    const Destinos = res.destinos

    if (!Destinos) return

    if (Destinos.error) {
      notificar('negative', Destinos.error)
      return
    }
    rows.value = Destinos
    console.log('--------')
    console.log(rows.value)


  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};
console.log("Antes de la línea 101");

onMounted(() => {
  obtenerInfo();
  console.log("inicio");
});


const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
  codigo: "",
  nombre: "",
  fecha_inicio: "",
  fecha_fin: "",
  nivel_de_formacion: "",
};
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info }
    data.value.fecha_inicio= info.fecha_inicio.slice(0, -14)
    data.value.fecha_fin= info.fecha_inicio.slice(0, -14)
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    console.log('guardar');
    try {
      console.log('response');
      const response = await useDestino.postDestinos(data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }

      rows.value.unshift(response);
      notificar('positive', 'Guardado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      const response = await useDestino.putDestino(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.destinos._id), 1, response.data.destinos);
      notificar('positive', 'Editado exitosamente')
      modal.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
};                                          
const in_activar = {
  putActivar: async (id) => {
    try {
      console.log(id);
      const response = await useDestino.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.destinos._id), 1, response.data.destinos);
      notificar('positive', 'Activado, exitosamente')
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  putInactivar: async (id) => {
    console.log("inactivar");
    try {
      console.log("Desactivar");
      const response = await useDestino.putInactivar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.destinos._id), 1, response.data.destinos);
      notificar('negative', 'Inactivado exitosamente')
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }

  },
};


function validarCampos() {

  const arrData = Object.entries(data.value)
  for (const d of arrData) {
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos")
      return
    }
    if (typeof d[1] === 'string') {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos")
        return
      }
    }

    if (d[0] === "codigo" && d[1].toString().length < 6) {
      notificar('negative', "El codigo debe tener más de 6 digitos")
      return
    }

    if (d[0] === "nombre" && d[1].length > 45) {
      notificar('negative', 'El nombre no puede tener más de 15 caracteres')
      return
    }

    if (d[0] === "año" && d[1].length !== 4) {
      notificar('negative', 'El año tiene que tener 4 caracteres')
      return
    }

    if (data.value.fecha_inicio.length > 10 || data.value.fecha_fin.length > 10){
    notificar('negative', 'la fecha no es valida')
      return
  }
  

  if ( new Date(data.value.fecha_inicio) > new Date(data.value.fecha_fin) ) {
    notificar('negative', 'la fecha de inicio debe ser antes de la fecha de cierre')
      return
  } 


   /*  if (d[0] === "email" && !d[1].includes('@')) {
      notificar('negative', 'Email no válido')
      return
    } */
  }
  enviarInfo[estado.value]()
}

function validateDate (value) {

  if (!value) {
    return 'ingrese una fecha'
  }

  if (value.length > 10){
    return `la fecha no es valida`;
  }
  

  if ( new Date(data.value.fecha_inicio) > new Date(data.value.fecha_fin) ) {
    return `la fecha de inicio debe ser antes de la fecha de cierre`;
  } 

  // esto para validar que la fecha no se pase de hoy 🚧
/*   const today = new Date();

  if ( new Date(value) > today) {
    return `La fecha de pedido no puede ser anterior a la actual.`;
  } */




  return true;
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
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">

          <q-input class="input1" outlined v-model="data.codigo" label="Codigo" type="number" maxlength="15" lazy-rules 
          :rules="[val => val.trim() != '' || 'Ingrese el codigo']"></q-input>

          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="45" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>

          <q-input class="input1" outlined v-model="data.fecha_inicio" label="fecha de inicio" type="date" maxlength="45" lazy-rules
            :rules="[val => validateDate(data.fecha_inicio) || 'Ingrese una fecha de inicio']"></q-input>

          <q-input class="input1" outlined v-model="data.fecha_fin" label="fecha de finalizacion" type="date" maxlength="45" lazy-rules
            :rules="[val => validateDate(data.fecha_fin) || 'Ingrese una fecha de finalizacion']"></q-input>

          <q-input class="input1" outlined v-model="data.nivel_de_formacion" label="nivel de formacion" type="text" maxlength="45" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nivel de formacion']"></q-input>





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

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.status == 1
              ? 'Activo'
              : props.row.status == 0
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.status == 1 ? 'primary' : 'secondary'" :loading="props.row.status == 'load'"
              loading-indicator-size="small" @click="
                props.row.status == 1
                  ? in_activar.putInactivar(props.row._id)
                  : in_activar.putActivar(props.row._id);
              props.row.status = 'load';
              " />
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>



<style scoped>
/* 
primary: Color principal del tema.
secondary: Color secundario del tema.
accent: Color de acento.
positive: Color para indicar una acción positiva o éxito.
negative: Color para indicar una acción negativa o error.
info: Color para información o mensajes neutrales.
warning: Color para advertencias o mensajes importantes. 
*/

* {
  margin: 0px;
  padding: 0px;
}

.modal {
  width: 100%;
  max-width: 600px;
}

.tabla {
  padding: 0 20px;
  margin: 10px auto;
  max-width: 1200px;
  /* min-height: 710px; */
  border: 0px solid black;
}

.titulo-cont {
  margin: auto;
}

.buscar {
  display: inline-block;
  margin: auto;
  margin-top: 8px;
  padding: 0px 15px;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 5px;
}

.encabezado {
  font-weight: bold;
  font-size: 15px;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}

.botonv1 {
  font-size: 10px;
  font-weight: bold;
}
</style>