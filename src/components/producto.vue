<!-- 
  <template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        title="Productos"
        :rows="rows"
        :columns="columns"
        row-key="name"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-td>
            <q-td key="calories" :props="props">
              {{ props.row.calories }}
              <q-popup-edit v-model="props.row.calories" title="Update calories" buttons v-slot="scope">
                <q-input type="number" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="fat" :props="props">
              <div class="text-pre-wrap">{{ props.row.fat }}</div>
              <q-popup-edit v-model="props.row.fat" v-slot="scope">
                <q-input type="textarea" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="carbs" :props="props">
              {{ props.row.carbs }}
              <q-popup-edit v-model="props.row.carbs" title="Update carbs" buttons persistent v-slot="scope">
                <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close" />
              </q-popup-edit>
            </q-td>
            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
            <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
            <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
            <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const columns = [
    { name: 'Codigo', align: 'center', label: 'Codigo', field: 'codigo', sortable: true },
    { name: 'Nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'Descripcion', align: 'center', label: 'Descripcion', field: 'descripcion', sortable: true},
    { name: 'Unidad_medida',align: 'center',  label: 'Unidad_medida', field: 'unidad_medida' },
    { name: 'Precio_unitario',align: 'center',  label: 'Precio_unitario', field: 'precio_unitario' },
    
    { name: 'Items',align: 'center',  label: 'Items', field: 'items' },
    { name: 'Estado',align: 'center',  label: 'Estado', field: 'status' },
  ]
  
  const rows = []
  </script>
  
  <style scoped>
  </style> -->

  

<script setup>
import { ref } from "vue";
/* import { useClienteStore } from "../stores/presupuesto.js"; */
import { useQuasar } from 'quasar'

const modelo = "Productos";
/* const useCliente = useClienteStore(); */
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
    sort: true,
    sortOrder: "da",
  },
  {
    name: "descripcion",
    label: "Descripcion",
    align: "left",
    field: (row) => row.descripcion,
  },
  {
    name: "unidad_medida",
    label: "Unidad medida",
    align: "left",
    field: (row) => row.unidad_medida,
  },
  {
    name: "precio_unitario",
    label: "Precio unitario",
    align: "left",
    field: (row) => row.precio_unitario,
  },
  {
    name: "impestos",
    label: "Impuestos",
    align: "left",
    field: (row) => row.impestos,
  },
  {
    name: "fecha_creacion",
    label: "Fecha creacion",
    align: "left",
    field: (row) => row.fecha_creacion,
  },
  {
    name: "fecha_vencimiento",
    label: "Fecha vencimiento",
    align: "left",
    field: (row) => row.fecha_vencimiento,
  },
  {
    name: "Estado",
    label: "Estado",
    align: "center",
    field: (row) => row.estado,
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
  descripcion: "",
  unidad_medida: "",
  precio_unitario: "",
  impestos: "",
  fecha_creacion: "",
  fecha_vencimiento: "",
});

const obtenerInfo = async () => {
  try {
    const cliente = await useCliente.obtener();

    console.log(cliente);

    if (!cliente) return

    if (cliente.error) {
      notificar('negative', cliente.error)
      return
    }
    rows.value = cliente.cliente;

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
      descripcion: "",
      unidad_medida: "",
      precio_unitario: "",
      impestos: "",
      fecha_creacion: "",
      fecha_vencimiento: "",

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
      const response = await useCliente.guardar(data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }

      rows.value.unshift(response.cliente);
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
      const response = await useCliente.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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
  activar: async (id) => {
    try {
      const response = await useCliente.activar(id);
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
      const response = await useCliente.inactivar(id);
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

/* function validarCampos() {

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

    if (d[0] === "nombre" && d[1].length > 15) {
      notificar('negative', 'El nombre no puede tener más de 15 caracteres')
      return
    }

    if (d[0] === "cedula" && d[1].toString().length < 8) {
      notificar('negative', "La cedula debe tener más de 8 digitos")
      return
    }

    if (d[0] === "email" && !d[1].includes('@')) {
      notificar('negative', 'Email no válido')
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
} */
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
            :rules="[val => val.trim() != '' || 'Ingrese un codigo']"></q-input>
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.descripcion" label="Descripcion" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una descripcion']"></q-input>
          <q-input class="input1" outlined v-model="data.unidad_medida" label="Unidad Medida" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una unidad de medida']"></q-input>
            <q-input class="input1" outlined v-model="data.precio_unitario" label="Precio Unitario" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el precio unitario']"></q-input>
          <q-input class="input1" outlined v-model="data.impestos" label="Impuestos" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un impuesto']"></q-input>
            <q-input class="input1" outlined v-model="data.fecha_creacion" label="Fecha creacion" type="date" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la fecha de creacion']"></q-input>
            <q-input class="input1" outlined v-model="data.fecha_vencimiento" label="Fecha vencimiento" type="date" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la fecha de vencimiento']"></q-input>
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
  max-width: 1210px;
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