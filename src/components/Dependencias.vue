
<script setup>
import { onMounted, ref } from "vue";
import { useDependStore } from "../stores/dependencia.js";
import { useDistLoteDependStore } from "../stores/dis_lote_dependencia";
import { useQuasar } from 'quasar'

const modelo = "";
const useDependencias = useDependStore();
const useDistLoteDepend = useDistLoteDependStore();
const loadingTable = ref(true)
const loadingTableDist = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const showModalRed = ref(false);

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
    name: "status",
    label: "Estado",
    align: "center",
    field: (row) => row.status,
  },
  {
    name: "opciones",
    label: "Opciones",
    field: "opciones",
    align: "center",
  },
]);
const rows = ref([]);
const rowsDist = ref([])

const data = ref({
  codigo: "",
  nombre: "",
});

const obtenerInfo = async () => {
  try {
    const dependencias = await useDependencias.obtenerInfoDepend();
    console.log(dependencias);

    if (!dependencias) return

    if (dependencias.error) {
      notificar('negative', dependencias.error)
      return
    }
    rows.value = dependencias

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

const obtenerInfoDist = async () => {
  try {
    const res = await useDistLoteDepend.obtenerInfoDepend();
    const dependencias = res.distribucion;
    console.log("useDistLoteDepend");
    console.log(dependencias);

    if (!dependencias) return;

    if (dependencias.error) {
      notificar('negative', dependencias.error);
      return;
    }

    rowsDist.value = dependencias;

    for (let i = 0; i < rowsDist.value.length; i++) {
      if (!rowsDist.value[i].dependencia) {
        continue;
      }
      
      console.log(i);
  const Index = rows.value.findIndex(objeto => objeto._id === rowsDist.value[i].dependencia._id);
  console.log(Index)
  if (Index !== -1) {
    // Asigna el detalle encontrado a una propiedad de la fila
    rows.value[Index].detalle = rowsDist.value[i];
  }

    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingTableDist.value = false;
  }
};
console.log("Antes de la línea 101");


onMounted(() => {
  obtenerInfo();
  console.log("inicio");
  obtenerInfoDist()
});


const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      codigo: "",
      nombre: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info }
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
    try {
      const response = await useDependencias.postDepend(data.value);
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
      const response = await useDependencias.putDepend(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.dep._id), 1, response.data.dep);
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
      const response = await useDependencias.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.dep._id), 1, response.data.dep);
      notificar('positive', 'Activado, exitosamente')
    } catch (error) {
      console.log(error);
      notificar('negative', response.error.data.error)
    } finally {
      loadingmodal.value = false;
    }
  },
  putInactivar: async (id) => {
    console.log("inactivar");
    try {
      const response = await useDependencias.putInactivar(id);
      console.log("Desactivar");
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.dep._id), 1, response.data.dep);
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }

  },
};

function validarCampos() {

  const arrData = Object.entries(data.value)
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
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

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar('negative', 'El nombre no puede tener más de 15 caracteres')
      return
    }

  }
  enviarInfo[estado.value]()
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
  <div class="titulo">Dependencias</div>
  <div class="container" >
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.codigo" label="Codigo" type="number"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un codigo']"></q-input>
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0;">
            <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white"
              v-close-popup>
              <q-icon name="cancel" color="white" right />
            </q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para la tabla de red de conocimiento -->
  <q-dialog v-model="showModalRed">
    <q-card class="modal">
      <q-toolbar>
        <q-toolbar-title>Red de conocimiento</q-toolbar-title>
        <q-btn flat round dense icon="close" @click="showModalRed = false" />
      </q-toolbar>
      <q-card-section>
        <q-table
          class="table col-12"
          flat
          square
          :rows="rowsDist"
          :columns="columns"
          row-key="_id"
          :loading="loadingTableDist"
          loading-label="Cargando datos, por favor espere..."
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props" :class="props.row.status === 'activo' ? 'text-positive' : 'text-negative'">
              {{ props.row.status }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>

    <div class="q-pa-md">
      <q-table :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[5, 10, 20, 0]"
        no-results-label="No hay resultados para la busqueda" dense>
        <template v-slot:top >
          <div class="headertabla">
          <h4 class="titulo-cont">
            {{ modelo + '' }}
            <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          </h4>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props"
              :auto-width="col.name == 'opciones'" :class="props.row.expanded ? 'no-border ' : ''">
              <q-div v-if="col.name != 'opciones' && col.name != 'status' ">
                {{ col.value }}
              </q-div>
              <q-div v-else-if="col.name == 'status'">
                <q-btn class="botonv1" padding="10px" :label="props.row.status == 1 ? 'Activo' : props.row.status == 0 ? 'Inactivo' : '‎  ‎   ‎   ‎   ‎ '"
                  :color="props.row.status == 1 ? 'primary' : 'secondary'" :loading="props.row.status == 'load'"
                  loading-indicator-size="small"
                  @click="props.row.status == 1 ? in_activar.putInactivar(props.row._id) : in_activar.putActivar(props.row._id); props.row.status = 'load';" />
              </q-div>
              <q-div v-else-if="col.name == 'opciones' ">
                <q-btn color="warning" icon="edit" class="text-caption q-pa-sm q-mx-xs" @click="opciones.editar(props.row)" />
                <q-btn class="text-caption q-pa-sm q-mx-xs" @click="props.row.expanded = !props.row.expanded"
                  :icon="props.row.expanded ? 'zoom_out' : 'zoom_in'" :color="props.row.expanded ? 'grey' : 'secondary'" />
              </q-div>
            </q-td>
          </tr>

          <tr :class="!props.row.expanded ? 'sinaltura' : ''" colspan="100%" :props="props">
            <td :class="!props.row.expanded ? 'no-border sinaltura' : ''" colspan="100%">
              <div class="show-p" :style="{ height: props.row.expanded ? '45px' : '0' }">
                <q-div class="">
                  <div class="text-center" v-if="props.row.detalle">
                    <q-btn colspan="100%" :loading="loadingTableDist" class="text-lowercase" flat>
                      <q-div class="q-mx-sm"><b>codigo presupuestal:</b> {{ props.row.detalle.codigo_presupuestal }}</q-div>
                      <q-div class="q-mx-sm"><b>presupuesto actual:</b> {{ props.row.detalle.presupuesto_actual }}</q-div>
                      <q-div class="q-mx-sm"><b>presupuesto asignado:</b> {{ props.row.detalle.presupuesto_asignado }}</q-div>
                    </q-btn>
                  </div>

                  <q-div class="text-center" v-if="!props.row.detalle">
                    <q-btn @click="opciones.agregar" label="crear" color="grey-6" class="text-capitalize text-white">
                      <q-icon name="add" color="white" right />
                    </q-btn>
                  </q-div>
                </q-div>
              </div>
            </td>
          </tr>
        </template>
      </q-table>
      
    </div>

    <div class="q-pa-md">
  <q-card class="custom-card">
    <q-card-section class="custom-card-header">
      <div class="text-h5 custom-card-title">Opciones</div>
    </q-card-section>

    <q-separator />

    <q-card-actions class="custom-card-actions">
      <router-link to="/Dis_dependencias">
        <q-btn flat label="Distribucción de dependencias" icon="science" size="md" class="custom-btn" />
      </router-link>
      <q-btn class="custom-btn" size="md" @click="showModalRed = true" icon="science" label="Red de conocimiento" />
    </q-card-actions>
  </q-card>
</div>

  </div>
</template>

<style scoped>
.container{
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;

}

.left-column,
.right-column {
  padding: 10px;
}

.tabla { 
  padding: 0 20px;
  height: 100% !important;
  width: 150% !important;
  float: left;

}

.headertabla{
  display: flex;
  flex-flow: row wrap;
  gap: 16px ;
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

.show-p {
  overflow: hidden;
}

.sinaltura {
  height: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.paddingnone {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.custom-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 60%;
  height: 50%;
  float: right;
  margin-left: 140px;
}

.custom-card-header {
  background-color: #38a151; /* Color de fondo del encabezado */
  color: #ffffff; /* Color del texto del encabezado */
  padding: 16px; /* Espaciado dentro del encabezado */
  text-align: center;
}

.custom-card-title {
  font-size: 18px; /* Tamaño del texto del título */
}

.custom-card-actions {
  padding: 16px; /* Espaciado dentro de las acciones de la tarjeta */
  display: flex;
  justify-content: space-between; /* Distribuir los botones equitativamente */
}

.custom-btn {
  border: 1px solid #38a151; /* Borde de color azul */
  border-radius: 5px; /* Bordes redondeados */
  color: #121213; /* Color del texto */
  padding: 10px 16px; /* Espaciado dentro del botón */
  text-transform: uppercase; /* Texto en mayúsculas */
  transition: background-color 0.3s, color 0.3s; 
  margin-bottom: 10px;
}

.custom-btn:hover {
  background-color: #38a151; 
  color: #e6e9ec; 
}

.highlight-btn {
  background-color: #4a90e2; 
  color: #ffffff; 
}

.highlight-btn:hover {
  background-color: #357ab7; 
}
.titulo{
  font-size: 300%;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

</style>
