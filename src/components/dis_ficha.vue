<!-- <template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        title="Treats"
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
    { name: 'Presupuesto', align: 'center', label: 'Presupuesto', field: 'presupuesto', sortable: true },
    { name: 'Distribucion_presupuesto', align: 'center', label: 'Distribucion_presupuesto', field: 'distribucion_presupuesto', sortable: true },
    { name: 'Ficha',align: 'center',  label: 'Ficha', field: 'ficha' },
    { name: 'Estado',align: 'center',  label: 'Estado', field: 'status' },
  ]
  
  const rows = []
  </script>
  
  <style scoped>
  </style> -->

  

  <script setup>
  import { onMounted, ref } from "vue";
  import { useDisFichaStore } from "../stores/dis_ficha.js";
  import { useQuasar } from 'quasar'
  
  const modelo = "Dis Ficha";
  const useDisFicha = useDisFichaStore();
  const loadingTable = ref(true)
  const $q = useQuasar()
  const filter = ref("");
  const loadingmodal = ref(false);
  
  const columns = ref([
    {
      name: "presupuesto",
      label: "presupuesto",
      align: "left",
      field: (row) => row.presupuesto,
      sort: true,
      sortOrder: "da",
    },
    {
      name: "distribucion_presupuesto",
      label: "distribucion_presupuesto",
      align: "left",
      field: (row) => row.distribucion_presupuesto,
  
    },
    {
      name: "ficha",
      label: "ficha",
      align: "left",
      field: (row) => row.ficha,
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
    presupuesto: "",
    distribucion_presupuesto: "",
    ficha: "",
  });
  
  const obtenerInfo = async () => {
    try {
      const disFicha = await useDisFicha.obtenerInfoDisFicha();
      console.log("useDisFicha")
      console.log(useDisFicha)
      console.log("dentro")
      console.log(disFicha);
  
      if (!disFicha) return
  
      if (disFicha.error) {
        notificar('negative', disFicha.error)
        return
      }
      rows.value = disFicha
  
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
  
  
  /* const estado = ref("guardar");
  const modal = ref(false);
  const opciones = {
    agregar: () => {
      data.value = {
        codigo_presupuestal: "",
        nombre: "",
        presupuesto_inicial: "",
        año: "",
        modificaciones: "",
        presupuesto_definitivo: "",
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
        const response = await useLote.postLotes(data.value);
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
        const response = await useLote.putLote(data.value._id, data.value);
        console.log(response);
        if (!response) return
        if (response.error) {
          notificar('negative', response.error)
          loadingmodal.value = false;
          return
        }
        console.log(rows.value);
        rows.value.splice(buscarIndexLocal(response.data.lotes._id), 1, response.data.lotes);
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
        const response = await useLote.putActivar(id);
        console.log(response);
        console.log("Activando");
        if (!response) return
        if (response.error) {
          notificar('negative', response.error)
          return
        }
        rows.value.splice(buscarIndexLocal(response.data.lotes._id), 1, response.data.lotes);
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
        const response = await useLote.putInactivar(id);
        console.log("Desactivar");
        console.log(response);
        if (!response) return
        if (response.error) {
          notificar('negative', response.error)
  
          return
        }
        rows.value.splice(buscarIndexLocal(response.data.lotes._id), 1, response.data.lotes);
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
  
      if (d[0] === "presupuesto_definitivo" && d[1].toString().length < 1) {
        notificar('negative', "El presupuesto definitivo debe ser diferente a 0")
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
            <q-input class="input1" outlined v-model="data.codigo_presupuestal" label="Codigo presupuestal" type="number"
              maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el codigo presupuestal']"></q-input>
            <q-input class="input1" outlined v-model="data.nombre" label="Nombre" type="text" maxlength="15" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese un nombre']"></q-input>
            <q-input class="input1" outlined v-model="data.presupuesto_inicial" label="Presupuesto inicial" type="number"
              maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese el presupuesto inicial']"></q-input>
            <q-input class="input1" outlined v-model="data.año" label="Año" type="text" maxlength="15" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese el año']"></q-input>
            <q-input class="input1" outlined v-model="data.modificaciones" label="Modificaciones" type="text" maxlength="15"
              lazy-rules :rules="[val => val.trim() != '' || 'Ingrese las modificaciones']"></q-input>
            <q-input class="input1" outlined v-model="data.presupuesto_definitivo" label="Presupuesto definitivo"
              type="text" maxlength="15" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese el presupuesto definitivo']"></q-input>
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
             <!--  <q-btn @click="opciones.agregar" label="Añadir" color="secondary">
                <q-icon name="style" color="white" right />
              </q-btn> -->
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