<template>
  <div>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>Agregar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
          <q-input class="input1" outlined v-model="data.cedula" label="Cedula" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese la cedula']"></q-input>
          <q-input class="input1" outlined v-model="data.correo" label="Correo" type="text" maxlength="30" lazy-rules
            :rules="[val => val.trim() != '' || 'Ingrese el correo']"></q-input>
          <q-input class="input1" outlined v-model="data.telefono" label="Telefono" type="number" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el telefono']"></q-input>
          <q-input class="input1" outlined v-model="data.contrasena" label="Contraseña" type="text" maxlength="15"
            lazy-rules :rules="[val => val.trim() != '' || 'Ingrese la contraseña']"></q-input>
            <q-select v-model="data.rol" :options="['Instructor', 'Administrador', 'Bodega', 'Supervisor']"label="Rol" outlined emit-value map-options/>
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table dense :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
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
          <q-td :props="props" class="botones" auto-width="">
            <q-btn color="warning" icon="edit" class="text-caption q-pa-sm q-ma-xs" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";
import { useQuasar } from 'quasar'

const modelo = "Usuarios";
const useUsuario = useUsuarioStore();
const loadingTable = ref(true)
const $q = useQuasar()
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
    name: "cedula",
    label: "Cedula",
    align: "left",
    field: (row) => row.cedula,
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
    name: "rol",
    label: "Rol",
    align: "left",
    field: (row) => row.rol,
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
  cedula: "",
  correo: "",
  telefono: "",
  contrasena: "",
  rol: "",
});

const obtenerInfo = async () => {
  try {
    const usuario = await useUsuario.obtenerInfoUsuarios();

    console.log(usuario)

    if (!usuario) return

    if (usuario.error) {
      notificar('negative', usuario.error)
      return
    }
    rows.value = usuario

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
      nombre: "",
      cedula: "",
      correo: "",
      telefono: "",
      contrasena: "",
      rol: "",
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
      const response = await useUsuario.postUsuarios(data.value);
      if (!response) return
      console.log(response);
      rows.value.unshift(response.usuarios);
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
      const response = await useUsuario.putUsuario(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        loadingmodal.value = false;
        return
      }
      console.log(rows.value);
      rows.value.splice(buscarIndexLocal(response.data.usuarios._id), 1, response.data.usuarios);
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
      console.log(id);
      const response = await useUsuario.putActivar(id);
      console.log(response);
      console.log("Activando");
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response.data.usuarios._id), 1, response.data.usuarios);
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
      console.log("Desactivar");
      const response = await useUsuario.putInactivar(id);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)

        return
      }
      rows.value.splice(buscarIndexLocal(response.data.usuarios._id), 1, response.data.usuarios);
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

    if (d[0] === "nombre" && d[1].length > 50) {
      notificar('negative', 'El nombre no puede tener más de 50 caracteres')
      return
    }

    if (d[0] === "cedula" && d[1].length > 10) {
      notificar('negative', 'La cedula no puede tener más de 10 caracteres')
      return
    }

    if (d[0] === "correo" && (d[1].length > 50 || !d[1].includes('@'))) {
      notificar('negative', 'El correo no puede tener más de 50 caracteres y debe contener "@"')
      return;
    }

    if (d[0] === "telefono" && d[1].length > 15) {
      notificar('negative', 'El telefono no puede tener más de 15 caracteres')
      return
    }

    if (d[0] === "contrasena" && d[1].length < 8) {
      notificar('negative', 'La contraseña no puede ser menor a 8 caracteres')
      return
    }

    if (d[0] === "rol" && d[1].length > 15) {
      notificar('negative', 'El rol no puede tener más de 15 caracteres')
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


<style scoped>
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
</style>

