<template>
  <div>
    <q-dialog v-model="modal" persistent>
      <q-card class="modal">
        <q-toolbar class="q-pr-xl q-pl-xl">
          <q-toolbar-title class="text-h5"
            >Agregar/Modificar {{ modelo }}</q-toolbar-title
          >
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section
          class="q-gutter-md row items-star justify-center continputs1"
        >
          <q-input
            class="modalinputs"
            outlined
            v-model="data.cantidad"
            label="Cantidad"
            type="number"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese una cantidad']"
          ></q-input>

          <q-input
            class="modalinputs"
            outlined
            v-model="data.total"
            label="total"
            type="text"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese el total']"
          ></q-input>

          <q-select
            filled
            v-model="data.idProducto"
            :options="seletProducto"
            label="Seleccione el producto"
            class="q-mx-auto"
            style="width: 300px"
          />
        </q-card-section>
        <q-card-section
          class="q-gutter-md row items-end justify-end continputs1"
          style="margin-top: 0"
        >
          <q-btn
            @click="validarCampos"
            :loading="loadingmodal"
            padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'"
            :label="estado"
          >
            <q-icon
              :name="estado == 'editar' ? 'edit' : 'style'"
              color="white"
              right
            />
          </q-btn>
          <q-btn
            :loading="loadingmodal"
            padding="10px"
            color="warning"
            label="cancelar"
            text-color="white"
            v-close-popup
          >
            <q-icon name="cancel" color="white" right />
          </q-btn>
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
import { useEntradaStore } from "../stores/entradas.js";
import { useProductoStore } from "../stores/producto.js";
import { useQuasar } from "quasar";

const modelo = "Entradas";
const useEntrada = useEntradaStore();
const useProductos = useProductoStore();
const loadingTable = ref(true);
const $q = useQuasar();
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "cantidad",
    label: "cantidad",
    align: "left",
    field: (row) => row.cantidad,
    sort: true,
    sortOrder: "da",
  },
  {
    name: "total",
    label: "Total",
    align: "left",
    field: (row) => row.total,
  },
  {
    name: "idProducto",
    label: "Producto",
    align: "left",
    field: (row) => row.idProducto.nombre,
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
  cantidad: "",
  total: "",
  idProducto: "",
});

let seletProducto = ref([]);

const obtenerProducto = async () => {
  try {
    const producto = await useProductos.obtenerInfoProducto();
    console.log("Todos los productos:", producto);

    seletProducto.value = producto.map((idProducto) => ({
      label: `${idProducto.nombre}`,
      value: String(idProducto._id),
    }));

    seletProducto.value.sort((a, b) => {
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

obtenerProducto();

const obtenerInfo = async () => {
  try {
    await Promise.all([obtenerProducto()]);
    const entradas = await useEntrada.obtenerInfoEntradas();
    console.log("useEntrada");
    console.log(useEntrada);
    console.log("dentro");
    console.log(entradas);

    if (!entradas) return;

    if (entradas.error) {
      notificar("negative", entradas.error);
      return;
    }
    rows.value = entradas;
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
      cantidad: "",
  total: "",
  idProducto: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {
      ...info,
      idProducto: { label: info.idProducto.nombre, value: info.idProducto._id },
    };
    console.log(data.value);
    modal.value = true;
    estado.value = "editar";
  },
};

const validateProducto = (value) => {
  if (!value) {
    return "Seleccione un producto";
  }

  return true;
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    try {
      const info = { ...data.value, idProducto: data.value.idProducto.value };
      const response = await useEntrada.postEntrada(info);
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
      const info = { ...data.value, idProducto: data.value.idProducto.value };
      const response = await useEntrada.putEntrada(data.value._id, info);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        loadingmodal.value = false;
        return;
      }

      rows.value.splice(
        buscarIndexLocal(response.data.entradas._id),
        1,
        response.data.entradas
      );
      notificar("positive", "Editado exitosamente");
      modal.value = false;
      obtenerInfo();
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
      const response = await useEntrada.putActivar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      const index = buscarIndexLocal(response.data.entradas._id);
      if (index !== -1) {
        rows.value[index] = response.data.entradas;
        notificar("positive", "Activado exitosamente");
      } else {
        notificar("negative", "No se pudo encontrar la entrada para activar");
      }
    } catch (error) {
      console.log(error);
    }
  },
  putInactivar: async (id) => {
    try {
      const response = await useEntrada.putInactivar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      const index = buscarIndexLocal(response.data.entradas._id);
      if (index !== -1) {
        rows.value[index] = response.data.entradas;
        notificar("positive", "Inactivado exitosamente");
      } else {
        notificar("negative", "No se pudo encontrar la entrada para inactivar");
      }
    } catch (error) {
      console.log(error);
    }
  },
};

function validarCampos() {
  const ProductoValidation = validateProducto(data.value.idProducto);
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
    if (d[0] === "cantidad" && d[1].toString().length < 1) {
      notificar("negative", "La cantidad es obligatoria");
      return;
    }
    if (d[0] === "total" && d[1].toString().length < 1) {
      notificar("negative", "La total es obligatoria");
      return;
    }
    if (d[0] === "idProducto" && d[1].toString().length < 1) {
      notificar("negative", "El producto unitario es obligatorio");
      return;
    }
    if (ProductoValidation !== true) {
      $q.notify({ type: "negative", message: ProductoValidation });
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
