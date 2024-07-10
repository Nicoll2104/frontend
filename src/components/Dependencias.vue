<script setup>
import { onMounted, ref } from "vue";
import { useDependStore } from "../stores/dependencia.js";
import { useDistLoteDependStore } from "../stores/dis_lote_dependencia";
import { useQuasar } from 'quasar'

const modelo = "Dependencias";
const useDependencias = useDependStore();
const useDistLoteDepend = useDistLoteDependStore();
const loadingTable = ref(true)
const loadingTableDist = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const showModal = ref(false); // Controla la visibilidad del modal

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
const rowsDist = ref([]);

const data = ref({
  codigo: "",
  nombre: "",
});

const obtenerInfo = async () => {
  try {
    const dependencias = await useDependencias.obtenerInfoDepend();
    console.log(dependencias);

    if (!dependencias) return;

    if (dependencias.error) {
      notificar('negative', dependencias.error);
      return;
    }
    rows.value = dependencias;
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false;
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
      const Index = rows.value.findIndex((objeto) => objeto._id === rowsDist.value[i].dependencia._id);
      console.log(Index);
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
  obtenerInfoDist();
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
    data.value = { ...info };
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
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        loadingmodal.value = false;
        return;
      }

      rows.value.unshift(response);
      notificar('positive', 'Guardado exitosamente');
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
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        loadingmodal.value = false;
        return;
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.dep._id), 1, response.data.dep);
      notificar('positive', 'Editado exitosamente');
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
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response.data.dep._id), 1, response.data.dep);
      notificar('positive', 'Activado, exitosamente');
    } catch (error) {
      console.log(error);
      notificar('negative', response.error.data.error);
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
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        return;
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
  const arrData = Object.entries(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar('negative', "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "") {
        notificar('negative', "Por favor complete todos los campos");
        return;
      }
    }

    if (d[0] === "codigo" && d[1].toString().length < 6) {
      notificar('negative', "El codigo debe tener más de 6 digitos");
      return;
    }

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar('negative', "El nombre no puede tener más de 15 caracteres");
      return;
    }
  }
  enviarInfo[estado.value]();
}

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}
</script>

<template>
  <div class="container">
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input
            class="input1"
            outlined
            v-model="data.codigo"
            label="Codigo"
            type="number"
            maxlength="15"
            lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un codigo']"
          ></q-input>
          <q-input
            class="input1"
            outlined
            v-model="data.nombre"
            label="Nombre"
            type="text"
            maxlength="15"
            lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"
          ></q-input>
          <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0;">
            <q-btn
              @click="validarCampos"
              :loading="loadingmodal"
              padding="10px"
              :color="estado == 'editar' ? 'warning' : 'secondary'"
              :label="estado"
            >
              <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
            </q-btn>
            <q-btn
              :loading="loadingmodal"
              padding="10px"
              color="warning"
              label="cancelar"
              text-color="white"
              @click="modal = false"
            >
              <q-icon name="cancel" color="white" right />
            </q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="containerq">
      <h3 class="titleq"> {{ modelo }} </h3>
      <div class="row col-2 justify-between contbotonq">
        <q-btn class="botonv1" size="sm" @click="opciones.agregar" color="secondary" icon="add" label="Agregar" />
        <q-btn class="botonv1" size="sm" @click="showModal = true" color="primary" icon="science" label="Red de conocimiento" />
      </div>
    </div>

    <q-input class="col-3" v-model="filter" dense debounce="300" placeholder="Buscar" />
    <q-table
      class="table col-12"
      flat
      square
      :rows="rows"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :loading="loadingTable"
      loading-label="Cargando datos, por favor espere..."
    >
      <template v-slot:body-cell-opciones="props">
        <q-td align="center" :props="props">
          <q-btn dense color="primary" icon="edit" @click="opciones.editar(props.row)" />
          <q-btn dense color="negative" icon="delete" @click="in_activar.putInactivar(props.row._id)" v-if="props.row.status === 'activo'" />
          <q-btn dense color="positive" icon="thumb_up" @click="in_activar.putActivar(props.row._id)" v-if="props.row.status === 'inactivo'" />
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props" :class="props.row.status === 'activo' ? 'text-positive' : 'text-negative'">
          {{ props.row.status }}
        </q-td>
      </template>
    </q-table>
  </div>

  <!-- Modal para la tabla de red de conocimiento -->
  <q-dialog v-model="showModal">
    <q-card class="modal">
      <q-toolbar>
        <q-toolbar-title>Red de conocimiento</q-toolbar-title>
        <q-btn flat round dense icon="close" @click="showModal = false" />
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
</template>

<style scoped>
.containerq {
  padding: 10px;

}
.titleq {
  margin-top: 10px;
}
.contbotonq {
  margin-top: 10px;
}
.input1 {
  margin-top: 10px;
}
.continputs1 {
  margin-top: 10px;
}
.table {
  margin-top: 20px;
}
.modal {
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}
</style>


