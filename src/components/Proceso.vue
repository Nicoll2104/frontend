<template>
    <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar/Modificar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
            <q-input class="input1" outlined v-model="data.codigo" label="Codigo" type="number"
            maxlength="10" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un código']"></q-input>
            <q-input class="input1" outlined v-model="data.presupuestoAsignado" label="Presupuesto Asignado" type="number"
            maxlength="10" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el Presupuesto Asignado']"></q-input>
            <q-input class="input1" outlined v-model="data.presupuestoDisponible" label="Presupuesto Disponible" type="number"
            maxlength="10" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el Presupuesto Disponible']"></q-input>
            <q-input class="input1" outlined v-model="data.fecha" label="Fecha" type="date" maxlength="45" lazy-rules
            :rules="[val => validateDate(data.fecha) || 'Ingrese una fecha']"></q-input>
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
  
      <div class="q-p-md">
        <q-table
        dense
          :rows="rows"
          :columns="columns"
          class="tabla"
          row-key="name"
          :loading="loadingTable"
          :filter="filter"
          rows-per-page-label="visualización de filas"
          page="2"
          :rows-per-page-options="[10, 20, 40, 0]"
          no-results-label="No hay resultados para la busqueda"
          wrap-cells="false"
        >
          <template v-slot:top>
            <h4 class="titulo-cont">
              {{ modelo + " " }}
              <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
                <q-icon name="style" color="white" right />
              </q-btn>
            </h4>
            <q-input
              borderless
              dense
              debounce="300"
              color="primary"
              v-model="filter"
              class="buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
  
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="encabezado"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
  
          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="botones">
              <q-btn
                class="botonv1"
                text-size="1px"
                padding="10px"
                :label="
                  props.row.status == 1
                    ? 'Activo'
                    : props.row.status == 0
                    ? 'Inactivo'
                    : '‎  ‎   ‎   ‎   ‎ '
                "
                :color="props.row.status == 1 ? 'primary' : 'secondary'"
                :loading="props.row.status == 'load'"
                loading-indicator-size="small"
                @click="
                  props.row.status == 1
                    ? in_activar.putInactivar(props.row._id)
                    : in_activar.putActivar(props.row._id);
                  props.row.status = 'load';
                "
              />
            </q-td>
          </template>
  
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="botones" auto-width>
              <q-btn
                color="warning"
                icon="edit"
                class="text-caption q-pa-sm q-ma-xs"
                @click="opciones.editar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { useProcesoStore } from "../stores/Proceso.js";
  import { useQuasar } from "quasar";
  
  const modelo = "Proceso";
  const useProceso = useProcesoStore();
  const loadingTable = ref(true);
  const $q = useQuasar();
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
      name: "presupuestoAsignado",
      label: "Presupuesto Asignado",
      align: "left",
      field: (row) => row.presupuestoAsignado,
    },
    {
      name: "presupuestoDisponible",
      label: "Presupuesto Disponible",
      align: "left",
      field: (row) => row.presupuestoDisponible,
    },
    {
      name: "fecha",
      label: "Fecha",
      align: "left",
      field: (row) => row.fecha.slice(0, -14),
    },
    {
      name: "status",
      label: "Estado",
      align: "center",
      field: (row) => row.status,
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
    nombre: "",
    presupuestoAsignado: "",
    presupuestoDisponible: "",
    fecha: "",
  });
  
  
  const obtenerInfo = async () => {
    try {
      const procesos = await useProceso.obtenerInfoProceso();
      console.log("useProceso");
      console.log(useProceso);
      console.log("dentro");
      console.log(procesos);
  
      if (!procesos) return;
  
      if (procesos.error) {
        notificar("negative", procesos.error);
        return;
      }
      rows.value = procesos;
    } catch (error) {
      console.error(error);
    } finally {
      loadingTable.value = false;
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
        nombre: "",
        presupuestoAsignado: "",
        presupuestoDisponible: "",
        fecha: "",
      };
      modal.value = true;
      estado.value = "guardar";
    },
    editar: (info) => {
    data.value = { ...info }
    data.value.fecha= info.fecha.slice(0, -14)
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
        const response = await useProceso.postProceso(data.value);
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
      } catch (error) {
        console.log(error);
      } finally {
        loadingmodal.value = false;
      }
    },
    editar: async () => {
      loadingmodal.value = true;
      try {
        const response = await useProceso.putProceso(
          data.value._id, data.value);
        console.log(response);
        if (!response) return;
        if (response.error) {
          notificar("negative", response.error);
          loadingmodal.value = false;
          return;
        }
        console.log(rows.value);
        rows.value.splice(
          buscarIndexLocal(response.data.procesos._id),
          1,
          response.data.procesos
        );
        notificar("positive", "Editado exitosamente");
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
        const response = await useProceso.putActivar(id);
        console.log(response);
        console.log("Activando");
        if (!response) return;
        if (response.error) {
          notificar("negative", response.error);
          return;
        }
        rows.value.splice(
          buscarIndexLocal(response.data.procesos._id),
          1,
          response.data.procesos
        );
        notificar("positive", "Activado, exitosamente");
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
    putInactivar: async (id) => {
      console.log("inactivar");
      console.log(id);
      try {
        const response = await useProceso.putInactivar(id);
        console.log(response);
        if (!response) return;
        if (response.error) {
          notificar("negative", response.error);
          return;
        }
        rows.value.splice(
          buscarIndexLocal(response.data.procesos._id),
          1,
          response.data.procesos
        );
        notificar("positive", "Inactivado exitosamente");
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
  };
  
  function validarCampos() {
    const arrData = Object.entries(data.value);
    console.log(arrData);
    for (const d of arrData) {
      console.log(d);
      if (d[1] === null) {
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
      if (typeof d[1] === "string") {
        if (d[1].trim() === "") {
          notificar("negative", "Por favor complete todos los campos");
          return;
        }
      }
  
      if (d[0] === "codigo" && d[1].length > 15) {
        notificar("negative", "El codigo no puede tener más de 15 caracteres");
        return;
      }
      if (d[0] === "presupuestoAsignado" && d[1].length > 15) {
        notificar("negative", "El presupuesto Asignado es obligatorio");
        return;
      }
      if (d[0] === "presupuestoDisponible" && d[1].toString().length < 1) {
        notificar("negative", "El presupuesto Disponible es obligatorio");
        return;
      }

      if (data.value.fecha.length > 10 ){
    notificar('negative', 'la fecha no es valida')
      return
  }
/*       if (loteValidation !== true) {
        $q.notify({ type: "negative", message: loteValidation });
        return;
      } */
    }
    enviarInfo[estado.value]();
  }
  
  function validateDate (value) {

if (!value) {
  return 'ingrese una fecha'
}

if (value.length > 10){
  return `la fecha no es valida`;
}

if ( new Date(value) > today) {
  return `La fecha de pedido no puede ser anterior a la actual.`;
} 

return true;
}
  function notificar(tipo, msg) {
    $q.notify({
      type: tipo,
      message: msg,
      position: "top",
    });
  }
  </script>
  
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
    max-width: 1300px;
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
  
  .continputs1 {
    border-top: solid 1px rgba(0, 0, 0, 0.212);
    margin-top: 2px;
  }
  
  .modalinputs {
    width: 400px;
    max-width: 80%;
  }
  
  .descripcioninput {
    width: 480px;
    max-width: 80%;
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