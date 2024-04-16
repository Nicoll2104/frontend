<script setup>
import { ref } from "vue";
import { useContratoStore } from "../stores/contrato.js";
import { useProveedorStore } from "../stores/proveedor.js";
import { useUsuarioStore } from "../stores/usuario.js";
import { useProcesoStore } from "../stores/Proceso.js";
import { useQuasar } from 'quasar'

const modelo = "Contrato";
const useContrato = useContratoStore();
const useUsuario = useUsuarioStore();
const useProveedor = useProveedorStore();
const useProceso = useProcesoStore();
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
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
  },
  {
    name: "presupuestoAsignado",
    label: "Presupuesto asignado",
    align: "left",
    field: (row) => row.presupuestoAsignado,
  },
  {
    name: "presupuestoActual",
    label: "Presupuesto Actual",
    align: "left",
    field: (row) => row.presupuestoActual,
  },
  {
    name: "supervisor",
    label: "Supervisor",
    align: "left",
    field: (row) => row.supervisor,
  },
  {
    name: "proveedor",
    label: "Proveedor",
    align: "left",
    field: (row) => row.proveedor,
  },
  {
    name: "proceso",
    label: "Proceso",
    align: "left",
    field: (row) => row.proceso,
  },
  {
    name: "opciones",
    label: "",
    field: "opciones",
    align: "center",

  },
]);

const rows = ref([]);

const data = ref({
  codigo: "",
  nombre: "",
  presupuestoAsignado: "",
  presupuestoActual: "",
  proveedor: "",
  proceso: "",
  supervisor: "",
  });

let seletProceso = ref([]);
let seletInstructor = ref([]);
let seletProveedor = ref([]);
let seletcompletado = ref([]);

/* const preciototal = data.cantidad * data.precioporunidad; */

const obtenerProveedor = async () => {
try {
  const proveedores = await useProveedor.obtenerInfoProveedor();
  console.log("Todos los proveedores:", proveedores);

  seletProveedor.value = proveedores.map((proveedor) => ({
    label: `${proveedor.nombre}`,
    value: String(proveedor._id),
  }));

  seletProveedor.value.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
} catch (error) {
  console.error(error);
}
};

obtenerProveedor();

const obtenerProceso = async () => {
try {
  const res = await useProceso.obtenerInfoProceso();
  const procesos = res.procesos
  console.log("Todos los Procesos:", procesos);

  seletProceso.value = procesos.map((proceso) => ({
    label: `${proceso.nombre}`,
    value: String(proceso._id),
  }));

  seletProceso.value.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
} catch (error) {
  console.error(error);
}
};

const obtenerUsuario = async () => {
try {
  const usuario = await useUsuario.obtenerInfoUsuarios();
  console.log("Todos los Instructores:", usuario);

  seletInstructor.value = usuario.map((instructor_encargado) => ({
    label: `${instructor_encargado.nombre}`,
    value: String(instructor_encargado._id),
  }));

  seletInstructor.value.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
} catch (error) {
  console.error(error);
}
};


/* const preciototal = data.cantidad * data.precioporunidad; */

const obtenerInfo = async () => {
  try {
    await Promise.all([obtenerProveedor(), obtenerUsuario(), obtenerProceso(), ]);
    const contratos = await useContrato.obtenerInfoContrato();

    console.log(contratos);

    if (!contratos) return

    if (contratos.error) {
      notificar('negative', contratos.error)
      return
    }
    rows.value = contratos;

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

obtenerInfo();

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      codigo: "",
      nombre: "",
      presupuestoAsignado: "",
      presupuestoActual: "",
      proveedor: "",
      proceso: "",
      supervisor: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {
      ...info,
      proveedor: {label: info.proveedor.nombre,value: info.proveedor}, // Asignar solo el ID del destino
      supervisor: {label: info.supervisor.nombre ,value: info.supervisor} , // Asignar solo el ID del instructor
    };
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
      const info = { ...data.value, supervisor: data.value.supervisor.value, proveedor:data.value.proveedor.value, proceso:data.value.proceso.value };
      const response = await useContrato.postContrato(info);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        loadingmodal.value = false;
        return;
      }

      rows.value.unshift(response);
      notificar("positive", "Guardado exitosamente");
      modal.value = false;
      obtenerInfo();
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  editar: async () => {
    loadingmodal.value = true;
    try {
      console.log('---------------------')
      console.log('peticion para editar:')
      console.log({
        ...data.value,
        proveedor: {...data.value.proveedor.value},
        supervisor: {...data.value.supervisor.value}, 
        proceso: {...data.value.proceso.value}, 
      })
      const response = await useContrato.putContrato(data.value._id, {
        ...data.value,
        proveedor: {...data.value.proveedor.value},
        supervisor: {...data.value.supervisor.value}, 
        proceso: {...data.value.proceso.value}, 
      });
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        loadingmodal.value = false;
        return;
      }
      const index = rows.value.findIndex((contratos) => contratos._id === response._id);
      rows.value.splice(index, 1, response);
      notificar('positive', 'Editado exitosamente');
      modal.value = false;
    } catch (error) {
      console.log(error);
      if (error.response){
        if (error.response.data){
          notificar('negative', error.response.data.error)
        }
      }
    } finally {
      loadingmodal.value = false;
    }
  },
};

const in_activar = {
  activar: async (id) => {
    try {
      const response = await useContrato.activar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
    } catch (error) {
      console.log(error);
    } finally {
      loadingmodal.value = false;
    }
  },
  inactivar: async (id) => {
    try {
      const response = await useContrato.inactivar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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

    if (d[0] === "codifo" && d[1].toString().length < 1) {
      notificar('negative', "El codigo es obligatoria")
      return
    }
    if (d[0] === "nombre" && d[1].toString().length < 1) {
      notificar('negative', "El nombre es obligatori0")
      return
    }
    if (d[0] === "presupuestoAsignado" && d[1].toString().length < 1) {
      notificar('negative', "El presupuesto asignado es obligatorio")
      return
    }
    if (d[0] === "presupuestoActual" && d[1].toString().length < 1) {
      notificar('negative', "El presupuesto Actual es obligatorio")
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

function prompt() {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>

<template>
  <div>
    <q-dialog v-model="modal" persistent color="primary">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title> Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />

        </q-toolbar>
        <!-- inputs🃏☝ -->

        <!-- btns 🛑👇 -->
        <q-card-section class="q-gutter-md row items-end justify-end continputs1">
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="secondary" label="imprimir">
            <q-icon name="print" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

        </q-card-section>
        <!-- btns 🛑☝ -->
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table dense :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" wrap-cells="false">
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
          </h4>
          <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
              <q-icon name="style" color="white" right />
            </q-btn>
          <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <router-link to="/proveedor" class="ingresarcont">
            <q-btn color="warning" icon-right="add_circle_outline" style="margin-right: 20px">Proveedor</q-btn>
         </router-link>
          <router-link to="/proceso" class="ingresarcont">
            <q-btn color="secondary" icon-right="add_circle_outline">Proceso</q-btn>
          </router-link>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="encabezado">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-Estado="props">
          <q-td :props="props" class="botones">
            <q-btn class="botonv1" text-size="1px" padding="10px" :label="props.row.estado === 1
              ? 'Activo'
              : props.row.estado === 0
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.estado === 1 ? 'positive' : 'accent'" :loading="props.row.estado === 'load'"
              loading-indicator-size="small" @click="
                props.row.estado === 1
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
              props.row.estado = 'load';
              " />
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones" auto-width>
            <q-btn color="warning" icon="zoom_in" class="text-caption q-pa-sm q-ma-xs" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      
      </q-table>

      <!-- <router-link to="/Det_pedido" class="ingresarcont">
        <q-btn class="ingresar opcion" color="primary">Crear Pedido
          <q-icon name="style" color="white" right />
        </q-btn>
      </router-link> -->
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



.modalinputs {
  width: 400px;
  max-width: 80%;
}

.descripcioninput {
  width: 100%;
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
</style>