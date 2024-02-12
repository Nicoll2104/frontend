<script setup>
import { onMounted, ref } from "vue";
import { usedisPresupuesStore } from "../stores/dis_presupuesto.js";
import { useQuasar } from 'quasar'
import { useLoteStore } from "../stores/lotes.js";
import { usePresupStore } from "../stores/presupuesto.js"

const modelo = "Dis Presupuesto";
const useDisPresupuesto = usedisPresupuesStore();
const useLote = useLoteStore();
const usePresupes = usePresupStore();
const loadingTable = ref(true);
const $q = useQuasar();
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "codigo_presupuestal",
    label: "Codigo presupuestal",
    align: "left",
    field: (row) => row.codigo_presupuestal,
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
    name: "presupuesto_inicial",
    label: "Presupuesto inicial",
    align: "left",
    field: (row) => row.presupuesto_inicial,
  },
  {
    name: "año",
    label: "Año",
    align: "left",
    field: (row) => row.año,
  },
  {
    name: "lote",
    label: "lote",
    align: "left",
    field: (row) => row.lote,
  },
  {
    name: "items",
    label: "items",
    align: "left",
    field: (row) => row.items,
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
let options = ref([]);

const data = ref({
  codigo_presupuestal: "",
  nombre: "",
  presupuesto_inicial: "",
  año: "",
  lote: "",
  items: "",
});

async function obtenerLotes() {
  try {
    const distribucion = await useLote.obtenerInfoLotes();
    const LotesAct = distribucion.filter(lote => lote.status === true);

    options.value = LotesAct.map((lote) => ({
      label: `${lote.nombre}`,
      value: String(lote._id),
    }));
    console.log("distribucion", distribucion);
    console.log("uselote", useLote);
    console.log("lotesactivos", LotesAct);
    console.log("opcions");
    console.log(options.value);
  } catch (error) {
    console.log(error);
  }
}

async function obtenerPresupues() {
  try {
    await usePresupes.obtenerInfoPresup();
    const PresupuesAct = usePresupes.presupuestos.filter(items => items.status === true);

    options.value = PresupuesAct.map((items) => ({
      label: `${items.codigo_presupuesto}`,
      value: String(items._id),
    }));
  } catch (error) {
    console.log(error);
  }
}

const obtenerInfo = async () => {
  try {
    const disPresupuesto = await useDisPresupuesto.obtenerInfodisPresupues();
    console.log("useDisPresupuesto")
    console.log(useDisPresupuesto)
    console.log("dentro")
    console.log(disPresupuesto);

    if (!disPresupuesto) return

    if (disPresupuesto.error) {
      notificar('negative', disPresupuesto.error)
      return
    }
    rows.value = disPresupuesto.distribucion

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
    obtenerPresupues();
    obtenerLotes();
    data.value = {
      codigo_presupuestal: "",
      nombre: "",
      presupuesto_inicial: "",
      año: "",
      lote: "",
      items: "",
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
      const response = await useDisPresupuesto.postDisPresupuesto(data.value);
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
      const response = await useDisPresupuesto.putDisPresupuesto(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.distribucion_id), 1, response.data.distribucion);
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
      const response = await useDisPresupuesto.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.distribucion._id), 1, response.data.distribucion);
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
      const response = await useDisPresupuesto.putInactivar(id);
      console.log("Desactivar");
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.distribucion._id), 1, response.data.distribucion);
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

    if (d[0] === "codigo_presupuestal" && d[1].toString().length < 6) {
      notificar('negative', "El codigo debe tener más de 6 digitos")
      return
    }

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar('negative', 'El nombre no puede tener más de 15 caracteres')
      return
    }

    if (d[0] === "presupuesto_inicial" && d[1].toString().length < 1) {
      notificar('negative', "El presupuesto inicial debe ser diferente a 0")
      return
    }

    if (d[0] === "año" && d[1].length > 4) {
      notificar('negative', 'El año no puede tener mas de 4 caracteres')
      return
    }

    if (d[0] === "lote" && d[1].toString().length < 1) {
      notificar('negative', "El lote es obligatorio")
      return
    }
    if (d[0] === "items" && d[1].toString().length < 1) {
      notificar('negative', "El items es obligatorio")
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
  <div>
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
          <q-input class="input1" outlined v-model="data.año" label="Año" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el año']"></q-input>
          <q-select v-model="data.lote" :options="options" label="Lotes" />
          <q-input class="input1" outlined v-model="data.lote" label="Lote" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el lote']"></q-input>
          <q-input class="input1" outlined v-model="data.items" label="Items" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el items de presupuesto']"></q-input>
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>
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

    <router-link to="/Dis_ficha" class="ingresarcont">
      <q-btn class="distribucion" color="primary" icon-right="chevron_right">Distribucion de ficha</q-btn>
    </router-link>
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