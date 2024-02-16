<template>
  <div class="q-pa-xl row items-start q-gutter-md justify-center ">
    <q-card class="my-card">
      <h5>Crear Pedido</h5>
    <div class="q-gutter-md" >
      <q-card-section class="q-gutter-md row items-star justify-center continputs1" >
        <q-input v-model="data.fecha_pedido" filled type="date" hint="Fecha de pedido" class="q-mx-auto" 
          style="width: 200px" lazy-rules :rules="[validateDate]" @update:model-value="validateDates"/>
        <q-input v-model="data.fecha_entrega" filled type="date" hint="Fecha de entrega" class="q-mx-auto" 
          style="width: 200px" lazy-rules :rules="[validateDate]" @update:model-value="validateDates"/>
      </q-card-section>
      <q-card-section class="q-gutter-md row items-star justify-center continputs1" style="margin-top: 0px;" >
        <q-input v-model="text" label="Nombre del Instructor" class="q-mx-auto" style="width: 250px" />
        <q-select filled v-model="data.ficha" :options="seletFicha" label="Seleccione la ficha" class="q-mx-auto" style="width: 350px" />
      </q-card-section>
      <q-card-section class="q-gutter-md row items-end justify-center continputs1" style="margin-top: 0px;">
        <q-btn @click="generarPedido" :loading="loadingmodal" padding="10px"
          color="secondary" label="guardar">
          <q-icon name="style" color="white" right />
        </q-btn>
      </q-card-section>
    </div>
  </q-card>
  <div v-if="showDetalleDiv" class="my-card">
  <q-card>
    <h5>Detalle Pedido</h5>
  <q-dialog v-model="modal">
    <q-card class="modal">
      <q-toolbar>
        <q-toolbar-title>Agregar producto</q-toolbar-title>
        <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="q-gutter-md">
        <q-select class="productoinput modalinputs" outlined v-model="data.producto_id" :options="selectProdut" label="Producto" 
        lazy-rules :rules="[val => val != '' || 'Seleccione el producto']"/>
        <q-input class="input1" outlined v-model="data.cantidad" label="Cantidad" type="number"
          maxlength="15" lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una cantidad']"></q-input>
        <q-btn @click="agregarProducto" :loading="loadingmodal" padding="10px"
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
          <q-btn @click="opciones.agregar" label="Agregar Producto" color="secondary">
            <q-icon name="shopping_cart" color="white" right />
          </q-btn>
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
   <!-- btns 🛑👇 -->
   <q-card-section class="q-gutter-md row items-end justify-end continputs1">
        <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
          color="secondary" label="guardar">
          <q-icon name="style" color="white" right />
        </q-btn>

        <q-btn :loading="loadingmodal" padding="10px"
          color="secondary" label="imprimir">
          <q-icon name="print" color="white" right />
        </q-btn>

        <q-btn :loading="loadingmodal" padding="10px"
          color="warning" label="cancelar" text-color="white" v-close-popup >
          <q-icon name="cancel" color="white" right />
        </q-btn>

      </q-card-section>
      <!-- btns 🛑☝ -->
</q-card>
</div>
</div>
</template>

<script setup>
import { ref } from "vue";
import { useFichaStore } from "../stores/ficha.js";
import { useProductoStore } from "../stores/producto.js";
import { useQuasar } from 'quasar';
import { isAfter, isValid, parse } from 'date-fns';
import { format } from "date-fns"


const modelo = "Crear Pedido";
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const fichaStore = useFichaStore();
const productoStore = useProductoStore();


const columns = ref([
  {
    name: "items",
    label: "Items",
    align: "left",
    field: (row) => row.items,

  },
  
  {
    name: "codigo",
    label: "Código",
    align: "left",
    field: (row) => row.id,
  },
  {
    name: "producto_id",
    label: "Producto",
    align: "left",
    field: (row) => row.nombre,

 
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "left",
    field: (row) => row.cantidad,
  },
]);
const rows = ref([]);

let selectProdut = ref([]);
let seletFicha = ref([]);
let showDetalleDiv = ref(false);

const data = ref({
  items: "",
  producto_id: "",
  cantidad: "",
  nombre_id: "",
});

const validateDate = (value) => {
  const today = new Date();
  const selectedDate = parse(value, 'yyyy-MM-dd', new Date());
  const isValidDate = isValid(selectedDate);

  if (!isValidDate) {
    return 'Ingrese una fecha válida.';
  }

  if (!isAfter(selectedDate, today)) {
    return 'La fecha no puede ser anterior a la actual.';
  }

  return true;
};

const validateDates = () => {
  if (data.fecha_pedido && data.fecha_entrega) {
    if (parse(data.fecha_pedido, 'yyyy-MM-dd', new Date()) > parse(data.fecha_entrega, 'yyyy-MM-dd', new Date())) {
      notificar('negative', 'La fecha de pedido no puede ser posterior a la fecha de entrega.');
      data.fecha_pedido = '';
      data.fecha_entrega = '';
    }
  }
};

function convertirFecha(cadenaFecha) {
  const fecha = new Date(cadenaFecha);
  const offset = 5 * 60;
  fecha.setMinutes(fecha.getMinutes() + offset);
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  const fechaFormateada = `${dia}/${mes}/${año}`;
  return fechaFormateada;
}

async function generarPedido() {
  showDetalleDiv.value = true;
};

const agregarPedido = (pedido) => {
  rows.value.push(pedido);
};

function sortBy(array, key) {
  return array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}


// funcion traer informacion de producto
const obtenerProducto = async () => {
  try{
    const producto = await productoStore.obtenerInfoProducto();
    const productAct = producto.filter(producto=> producto.status === "1")
    selectProdut.value = productAct.map((items) => ({
      label: `${items.nombre}` + `${ - items.codigo}`,
      value: String(items._id)
    }));
    sortBy(selectProdut.value, 'label');
    console.log("select de productos",selectProdut);
  }catch (error) {
    console.error(error);
  }
}
obtenerProducto();

const obtenerFicha = async () => {
  try{
    const ficha = await fichaStore.obtenerInfoFichas();
    const fichaAct = ficha.filter(fichas=> fichas.status === "1")
    console.log("fichas activas",fichaAct);
    seletFicha.value = fichaAct.map((items) => ({
      label: `${items.codigo_ficha}`,
      value: String(items._id)
    }));
    sortBy(seletFicha.value, 'label');
  }catch (error) {
    console.error(error);
  }
}

obtenerFicha();

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
    console.log("datos tabla", rows.value);

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

const estado = ref("agregarProducto");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      cantidad: "",
      pedido_id: "",
      producto_id: "",
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
  max-width: 1200px;
  /* min-height: 710px; */
  border: 0px solid black;
}
.my-card{
  width: 100%;
  max-width: 1500px;
  align-items: center;
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
