<template>
    <div class="q-pa-xl row items-start q-gutter-md justify-center ">
      <q-card class="my-card">
        <h5>Detalle Pedido</h5>
        <q-btn color="warning" icon-right="edit_note" @click="mostrarModalAgregar">Detalle de salida</q-btn>
        <q-dialog v-model="showAgregar">
          <q-card class="modal">
            <q-toolbar>
              <q-toolbar-title>Agregar producto</q-toolbar-title>
              <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section class="q-gutter-md">
              <q-input class="input1" outlined v-model="data.cantidad" label="Cantidad" type="number" maxlength="15"
                lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una cantidad']"></q-input>
                <q-select class="pedidoinput modalinputs" outlined v-model="data.pedido_id" :options="selectPedido"
                label="Pedido" lazy-rules :rules="[val => val != '' || 'Seleccione el pedido']" />
              <q-select class="productoinput modalinputs" outlined v-model="data.producto_id" :options="selectProdut"
                label="Producto" lazy-rules :rules="[val => val != '' || 'Seleccione el producto']" />
                <q-input class="input1" outlined v-model="data.subtotal" label="Subtotal" type="number" maxlength="15"
                lazy-rules :rules="[val => val.trim() != '' || 'Ingrese un subtotal']"></q-input>
              
              <q-btn @click="agregarDetallePedido( data.cantidad, data.pedido_id, data.producto_id,data.subtotal)" :loading="loadingmodal"
                padding="10px" :label="estado == 'editar' ? 'Editar' : 'Guardar'"
                :color="estado == 'editar' ? 'warning' : 'secondary'">
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
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="secondary" label="imprimir">
            <q-icon name="print" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white"
            v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

        </q-card-section>
        <!-- btns 🛑☝ -->
      </q-card>
    </div>
  <!--     <div v-if="showDetalleDiv" class="my-card"> -->
  <!--   </div> -->
</template>

<script setup>
import { ref } from "vue";
import { useFichaStore } from "../stores/ficha.js";
import { useProductoStore } from "../stores/producto.js";
import { useUsuarioStore } from "../stores/usuario.js";
import { usedetPedidoStore } from "../stores/det_pedido.js";
import { usePedidoStore } from "../stores/pedido.js";
import { useQuasar } from 'quasar';
import { isAfter, isValid, parse } from 'date-fns';
import { format } from "date-fns"
import { Notify } from 'quasar';


const modelo = "Crear Pedido";
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const productoStore = useProductoStore();
const detPedidoStore = usedetPedidoStore();
const showAgregar = ref(false);
const enviarInfoestado = ref(false);
const PedidoStore = usePedidoStore()

const columns = ref([
  {
    name: "cantidad",
    label: "Cantidad",
    align: "left",
    field: (row) => row.cantidad,
  },
  {
    name: "pedido_id",
    label: "Pedido",
    align: "left",
    field: (row) => row.pedido_id,
  },
  {
    name: "producto_id",
    label: "Producto",
    align: "left",
    field: (row) => row.producto_id,
  },
  {
    name: "subtotal",
    label: "Subtotal",
    align: "left",
    field: (row) => row.subtotal,
  },


]);
const rows = ref([]);
let options = ref([]);
let itemsPre = ref([]);

let selectProdut = ref([]);
let selectPedido = ref([]);


const data = ref({
  cantidad: "",
  pedido_id: "",
  producto_id: "",
  subtotal:"",
});

const opciones = {
  agregar: () => {
    data.value = {
      cantidad: "",
      pedido_id: "",
      producto_id: "",
      subtotal:"",
    };
    showAgregar.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = { ...info }
    modal.value = true;
    estado.value = "editar";
  },
};

const mostrarModalAgregar = () => {
  showAgregar.value = true; 
};

const obtenerProducto = async () => {
  try {
    const producto = await productoStore.obtenerInfoProducto();
    const productAct = producto.filter(producto => producto.status === "1")
    selectProdut.value = productAct.map((items) => ({
      label: `${items.nombre}` + `${- items.codigo}`,
      value: String(items._id)
    }));
    sortBy(selectProdut.value, 'label');
    console.log("select de productos", selectProdut);
  } catch (error) {
    console.error(error);
  }
}
obtenerProducto();

 const obtenerPedido = async () => {
  try {
    const pedidos = await PedidoStore.obtenerInfoPedido();
    const pedidoAct = pedidos.filter(pedidos => pedidos.status === "1")
    selectPedido.value = pedidoAct.map((pedido_id) => ({
      label: `${pedido_id.completado}` + `${- pedido_id.total}`,
      value: String(pedido_id._id)
    }));
    sortBy(selectPedido.value, 'label');
    console.log("select de pedidos", selectPedido);
  } catch (error) {
    console.error(error);
  }
}
obtenerPedido(); 
const obtenerInfo = async () => {
  try {
    await Promise.all([obtenerProducto(), obtenerPedido()]);
    const det_pedido = await detPedidoStore.obtenerInfodetPedido();
    console.log("detPedidoStore");
    console.log(detPedidoStore);
    console.log("dentro");
    console.log(det_pedido);

    if (!det_pedido) return;

    if (det_pedido.error) {
      notificar("negative", det_pedido.error);
      return;
    }
    rows.value = det_pedido;
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
};
console.log("Antes de la línea 101");


  obtenerInfo();
  console.log("inicio");
;


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
  max-width: 900px;
  /* min-height: 710px; */
  border: 0px solid black;
}

.my-card {
  width: 100%;
  max-width: 1200px;
  align-items: center;
  margin-top: 0px;
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
