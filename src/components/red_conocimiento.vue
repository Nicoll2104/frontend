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
            v-model="data.codigo"
            label="Codigo"
            type="number"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese un codigo']"
          ></q-input>

          <q-input
            class="modalinputs"
            outlined
            v-model="data.nombre"
            label="Nombre"
            type="text"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese un nombre']"
          ></q-input>

          <q-input
            class="descripcioninput modalinputs"
            outlined
            v-model="data.descripcion"
            label="Descripcion"
            type="textarea"
            maxlength="30"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese una descripcion']"
          ></q-input>

          <q-input
            class="modalinputs"
            outlined
            v-model="data.unidad_medida"
            label="Unidad Medida"
            type="text"
            maxlength="15"
            lazy-rules
            :rules="[
              (val) => val.trim() != '' || 'Ingrese una unidad de medida',
            ]"
          ></q-input>

          <q-input
            class="modalinputs"
            outlined
            v-model="data.precio_unitario"
            label="Precio Unitario"
            type="number"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese el precio unitario']"
          ></q-input>

          <q-input
            class="modalinputs"
            outlined
            v-model="data.iva"
            label="Impuestos"
            type="number"
            maxlength="15"
            lazy-rules
            :rules="[(val) => val.trim() != '' || 'Ingrese un impuesto']"
          ></q-input>

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

          <q-select
            filled
            v-model="data.lote"
            :options="seletLote"
            label="Seleccione el lote"
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
          <router-link to="/entradas" class="ingresarcont">
            <q-btn color="warning" icon-right="add_circle_outline">Entradas</q-btn>
          </router-link>

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
import { useRedConocimientoStore  } from "../stores/red_conocimiento.js";
import { useLoteStore } from "../stores/lotes.js";
import { useQuasar } from "quasar";

const modelo = "Red de conocimiento";
const useRedCon = useRedConocimientoStore();
const loteStore = useLoteStore();
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
    sort: true,
    sortOrder: "da",
  },
  {
    name: " Id_depedencias",
    label: " Depedencias",
    align: "left",
    field: (row) => row.Id_depedencias,
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
  Id_depedencias: ""

});

let seletLote = ref([]);

const obtenerLote = async () => {
  try {
    const lotes = await loteStore.obtenerInfoLotes();
    console.log("Todos los lotes:", lotes);

    seletLote.value = lotes.map((lote) => ({
      label: `${lote.nombre}`,
      value: String(lote._id),
    }));

    seletLote.value.sort((a, b) => {
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

obtenerLote();

const obtenerInfo = async () => {
  try {
    await Promise.all([obtenerLote()]);
    const productos = await useRedCon.obtenerInfoProducto();
    console.log("useRedCon");
    console.log(useRedCon);
    console.log("dentro");
    console.log(productos);

    if (!productos) return;

    if (productos.error) {
      notificar("negative", productos.error);
      return;
    }
    rows.value = productos;
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
      codigo: "",
      nombre: "",
      descripcion: "",
      unidad_medida: "",
      precio_unitario: "",
      iva: "",
      cantidad: "",
      lote: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {
      ...info,
      lote: { label: info.lote.nombre, value: info.lote._id },
    };
    console.log(data.value);
    modal.value = true;
    estado.value = "editar";
  },
};

const validatelote = (value) => {
  if (!value) {
    return "Seleccione un lote";
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
      const info = { ...data.value, lote: data.value.lote.value };
      const response = await useRedCon.postProducto(info);
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
      const info = { ...data.value, lote: data.value.lote.value };
      const response = await useRedCon.putProducto(
        data.value._id,
        info
      );
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        loadingmodal.value = false;
        return;
      }
      console.log(rows.value);
      rows.value.splice(
        buscarIndexLocal(response.data.productos._id),
        1,
        response.data.productos
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
      const response = await useRedCon.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      rows.value.splice(
        buscarIndexLocal(response.data.productos._id),
        1,
        response.data.productos
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
      const response = await useRedCon.putInactivar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      rows.value.splice(
        buscarIndexLocal(response.data.productos._id),
        1,
        response.data.productos
      );
      notificar("positive", "Inactivado exitosamente");
    } catch (error) {
      console.log(error);
    } finally {
    }
  },
};

function validarCampos() {
  const loteValidation = validatelote(data.value.lote);
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

    if (d[0] === "codigo" && d[1].toString().length < 6) {
      notificar("negative", "El codigo debe tener más de 6 digitos");
      return;
    }

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar("negative", "El nombre no puede tener más de 15 caracteres");
      return;
    }

    if (d[0] === "descripcion" && d[1].toString().length < 1) {
      notificar("negative", "La descripcion es obligatoria");
      return;
    }
    if (d[0] === "unidad_medida" && d[1].toString().length < 1) {
      notificar("negative", "La unidad de medida es obligatoria");
      return;
    }
    if (d[0] === "precio_unitario" && d[1].toString().length < 1) {
      notificar("negative", "El precio unitario es obligatorio");
      return;
    }
    if (d[0] === "iva" && d[1].toString().length < 1) {
      notificar("negative", "El valor del impuesto es obligatorio");
      return;
    }
    if (d[0] === "cantidad" && d[1].toString().length < 1) {
      notificar("negative", "La cantidad es obligatorio");
      return;
    }
    if (d[0] === "lote" && d[1].toString().length < 1) {
      notificar("negative", "El lote es obligatorio");
      return;
    }
    if (loteValidation !== true) {
      $q.notify({ type: "negative", message: loteValidation });
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
