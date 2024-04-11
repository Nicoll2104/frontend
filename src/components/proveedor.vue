<template>
    <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar/Modificar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
            <q-input class="input1" outlined v-model="data.nombre" label="Nombre o Razón social" type="text" maxlength="20" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el nombre o Razón social']"></q-input>
            <q-input class="input1" outlined v-model="data.dni" label="Identificación" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un número de identificación']"></q-input>
            <q-input class="input1" outlined v-model="data.correo" label="Correo electrónico" type="text" maxlength="20" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un correo electronico']"></q-input>
            <q-input class="input1" outlined v-model="data.telefono" label="Telefono" type="number"
            maxlength="10" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un número de telefono']"></q-input>
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
            <q-td :props="props" class="botones">
              <q-btn
                color="warning"
                icon="edit"
                class="botonv1"
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
  import { useProveedorStore } from "../stores/proveedor.js";
  import { useQuasar } from "quasar";
  
  const modelo = "Proveedor";
  const useProveedor = useProveedorStore();
  const loadingTable = ref(true);
  const $q = useQuasar();
  const filter = ref("");
  const loadingmodal = ref(false);
  
  const columns = ref([
    {
      name: "nombre",
      label: "Nombre",
      align: "left",
      field: (row) => row.nombre,
    },
    {
      name: "dni",
      label: "Identificación",
      align: "left",
      field: (row) => row.dni,
    },
    {
      name: "correo",
      label: "Correo",
      align: "left",
      field: (row) => row.correo,
    },
    {
      name: "telefono",
      label: "Telefono",
      align: "left",
      field: (row) => row.telefono,
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
    nombre: "",
    dni: "",
    correo: "",
    telefono: "",
  });
  
  
  const obtenerInfo = async () => {
    try {
      const proveedores = await useProveedor.obtenerInfoProveedor();
      console.log("useProveedor");
      console.log(useProveedor);
      console.log("dentro");
      console.log(proveedores);
  
      if (!proveedores) return;
  
      if (proveedores.error) {
        notificar("negative", proveedores.error);
        return;
      }
      rows.value = proveedores;
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
        dni: "",
        correo: "",
        telefono: "",
      };
      modal.value = true;
      estado.value = "guardar";
    },
    editar: (info) => {
      data.value = {
        ...info,
      };
      console.log(data.value);
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
        const response = await useProveedor.postProveedor(data.value);
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
        const info = { ...data.value};
        const response = await useProveedor.putProveedor(
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
          buscarIndexLocal(response.data.provedores._id),
          1,
          response.data.provedores
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
        const response = await useProveedor.putActivar(id);
        console.log(response);
        console.log("Activando");
        if (!response) return;
        if (response.error) {
          notificar("negative", response.error);
          return;
        }
        rows.value.splice(
          buscarIndexLocal(response.data.provedores._id),
          1,
          response.data.proveedores
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
        const response = await useProveedor.putInactivar(id);
        console.log(response);
        if (!response) return;
        if (response.error) {
          notificar("negative", response.error);
          return;
        }
        rows.value.splice(
          buscarIndexLocal(response.data.provedores._id),
          1,
          response.data.provedores
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
  
      if (d[0] === "nombre" && d[1].length > 15) {
        notificar("negative", "El nombre no puede tener más de 15 caracteres");
        return;
      }
      if (d[0] === "dni" && d[1].length > 15) {
        notificar("negative", "La identificacion no puede tener más de 15 caracteres");
        return;
      }
      if (d[0] === "correo" && d[1].toString().length < 1) {
        notificar("negative", "El correo es obligatoria");
        return;
      }
      if (d[0] === "telefono" && d[1].toString().length < 1) {
        notificar("negative", "El telefono es obligatorio");
        return;
      }
/*       if (loteValidation !== true) {
        $q.notify({ type: "negative", message: loteValidation });
        return;
      } */
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