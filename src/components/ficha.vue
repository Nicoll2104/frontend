<!-- <template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        title="Fichas"
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
    { name: 'Nivel_formacion', align: 'center', label: 'Nivel_formacion', field: 'nivel_formacion', sortable: true },
    { name: 'Fecha_inicio',align: 'center',  label: 'Fecha_inicio', field: 'fecha_inicio' },
    { name: 'Fecha_fin',align: 'center',  label: 'Lote', field: 'lote' },
    { name: 'codigo_area',align: 'center',  label: 'Lote', field: 'lote' },
    { name: 'Items',align: 'center',  label: 'Items', field: 'items' },
    { name: 'Estado',align: 'center',  label: 'Estado', field: 'status' },
  ]
  
  const rows = []
  </script>
  
  <style scoped>
  </style> -->

<script setup>
import { ref } from "vue";
import { useClienteStore } from "../stores/clientes.js";
import { useQuasar } from 'quasar'

const modelo = "Fichas";
const useCliente = useClienteStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);

const columns = ref([
  {
    name: "codigo_ficha",
    label: "Codigo Ficha",
    align: "left",
    field: (row) => row.codigo_ficha,
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
    name: "nivel_de_formacion",
    label: "Nivel formacion",
    align: "left",
    field: (row) => row.nivel_de_formacion,
  },
  {
    name: "fecha_inicio",
    label: "Fecha inicio",
    align: "left",
    field: (row) => row.fecha_inicio,
  },
  {
    name: "fecha_fin",
    label: "Fecha fin",
    align: "left",
    field: (row) => row.fecha_fin,
  },
  {
    name: "codigo_area",
    label: "Codigo area",
    align: "left",
    field: (row) => row.codigo_area,
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
  codigo_ficha: "",
  nombre: "",
  nivel_de_formacion: "",
  fecha_inicio: "",
  fecha_fin: "",
  codigo_area: "",
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
      codigo_ficha: "",
      nombre: "",
      nivel_de_formacion: "",
      fecha_inicio: "",
      fecha_fin: "",
      codigo_area: "",
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
} */

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
          <q-input class="input2" outlined v-model="data.codigo_ficha" label="Codigo ficha" type="number" lazy-rules
            :rules="[val => val != '' || 'Ingrese el codigo', val => val.length < 11 || 'Cedula debe tener 10 o menos carácteres']"
            maxlength="10"></q-input>
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.nivel_de_formacion" label="Nivel formacion" type="text"
            maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un nivel de formacion']"></q-input>
          <q-input class="input1" outlined v-model="data.fecha_inicio" label="Fecha inicio" type="date" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una fecha inicio']"></q-input>
          <q-input class="input1" outlined v-model="data.fecha_fin" label="Fecha fin" type="date" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una fecha fin']"></q-input>
          <q-input class="input2" outlined v-model="data.codigo_area" label="Codigo area" type="number" lazy-rules
            :rules="[val => val != '' || 'Ingrese el codigo de area', val => val.length < 11 || 'Cedula debe tener 10 o menos carácteres']"
            maxlength="10"></q-input>
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
    <router-link to="/Dis_ficha" class="ingresarcont">
      <button class=" personalizado">Distribucion fichas</button>
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
  max-width: 1000px;
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
.personalizado {
  font-size: 20px;
  font-weight: 700;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 20px;
  background: linear-gradient(to right, #29A19C, #3F497F); 
  transition: background 0.3s ease; 
}

.personalizado:hover {
  background: linear-gradient(to right, #3F497F, #29A19C);
}
</style>