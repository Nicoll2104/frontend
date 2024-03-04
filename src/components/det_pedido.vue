<template>
  <div class="q-pa-xl row items-start q-gutter-md justify-center ">
    <q-card class="my-card">
      <h5>Crear Pedido</h5>
      <div class="q-gutter-md">
        <q-card-section class="q-gutter-md row items-star justify-center continputs1">
          <q-input v-model="dataPedido.fecha_pedido" filled type="date" hint="Fecha de pedido" class="q-mx-auto"
            style="width: 200px" lazy-rules :rules="[dataPedido.validateDate]" @update:model-value="validateDates" />
          <q-input v-model="dataPedido.fecha_entrega" filled type="date" hint="Fecha de entrega" class="q-mx-auto"
            style="width: 200px" lazy-rules :rules="[dataPedido.validateDate]" @update:model-value="validateDates" />
        </q-card-section>
        <q-card-section class="q-gutter-md row items-star justify-center continputs1" style="margin-top: 0px;">
          <q-select filled v-model="dataPedido.usuario" :options="seletusuario" label="Seleccione el usuario" class="q-mx-auto"
            style="width: 300px" />
          <q-select filled v-model="dataPedido.ficha" :options="seletFicha" label="Seleccione la ficha" class="q-mx-auto"
            style="width: 300px" />
        </q-card-section>
        <q-card-section class="q-gutter-md row items-end justify-center continputs1" style="margin-top: 0px;">
          <q-btn @click="validarCamposPedidos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>
  <div v-if="showDetalleDiv" class="my-card">
    <div class="q-pa-xl row items-start q-gutter-md justify-center ">
      <q-card class="my-card">
        <h5>Detalle Pedido</h5>
        <q-dialog v-model="showAgregar">
          <q-card class="modal">
            <q-toolbar>
              <q-toolbar-title>Agregar producto</q-toolbar-title>
              <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section class="q-gutter-md">
              <q-select class="productoinput modalinputs" outlined v-model="data.producto_id" :options="selectProdut"
                label="Producto" lazy-rules :rules="[val => val != '' || 'Seleccione el producto']" />
              <q-input class="input1" outlined v-model="data.cantidad" label="Cantidad" type="number" maxlength="15"
                lazy-rules :rules="[val => val.trim() != '' || 'Ingrese una cantidad']"></q-input>
              <q-btn @click="agregarDetallePedido(data.producto_id, data.cantidad)" :loading="loadingmodal" padding="10px"
                label="GUARDAR" :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
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

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

        </q-card-section>
        <!-- btns 🛑☝ -->
      </q-card>
    </div>
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
import { useQuasar } from 'quasar';
import { isAfter, isValid, parse } from 'date-fns';
import { format } from "date-fns"
import { Notify } from 'quasar';


const modelo = "Crear Pedido";
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const fichaStore = useFichaStore();
const productoStore = useProductoStore();
const usuarioStore = useUsuarioStore();
const detPedidoStore = usedetPedidoStore();
const enviarInfoestado = ref(false);


const columns = ref([
  {
    name: "cantidad",
    label: "Cantidad",
    align: "left",
    field: (row) => row.cantidad,
  },
  {
    name: "producto_id",
    label: "Producto",
    align: "left",
    field: (row) => row.producto_id,
  },

]);
const rows = ref([]);
let options = ref([]);
let itemsPre = ref([]);

let selectProdut = ref([]);
let seletFicha = ref([]);
let seletusuario = ref([]);


let showDetalleDiv = ref(false);
let showAgregar = ref(false);


const dataPedido = ref({
  fecha_pedido: "",
  fecha_entrega: "",
  usuario: "",
  ficha: "",
  validateDate: (value) => {
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
  },
});

const data = ref({
  cantidad: "",
  pedido_id: "",
  producto_id: "",
});

const opciones = {
  agregar: () => {
    data.value = {
      cantidad: "",
      pedido_id: "",
      producto_id: "",
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



const validateUsuario = (value) => {
  if (!value) {
    return 'Seleccione un usuario.';
  }
  return true;
};

const validateFicha = (value) => {
  if (!value) {
    return 'Seleccione una ficha.';
  }

  return true;
};

/* const validarCamposPedidos = () => {
  const fechaPedidoValidation = dataPedido.value.validateDate(dataPedido.value.fecha_pedido);
  const fechaEntregaValidation = dataPedido.value.validateDate(dataPedido.value.fecha_entrega);
  const usuarioValidation = validateUsuario(dataPedido.value.usuario);
  const fichaValidation = validateFicha(dataPedido.value.ficha);


  if (fechaPedidoValidation !== true) {
    $q.notify({ type: 'negative', message: fechaPedidoValidation });
    return;
  }
  if (fechaEntregaValidation !== true) {
    $q.notify({ type: 'negative', message: fechaEntregaValidation });
    return;
  }
  if (usuarioValidation !== true) {
    $q.notify({ type: 'negative', message: usuarioValidation });
    return;
  }
  if (fichaValidation !== true) {
    $q.notify({ type: 'negative', message: fichaValidation });
    return;
  }

}; */

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

const agregarPedido = (pedido) => {
  rows.value.push(pedido);
};

function sortBy(array, key) {
  return array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}


// funcion traer informacion de producto
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

async function agregarDetallePedido() {
  if (validacionDetallePedido.value == true) {
    try {
      showDefault();
      await ticketStore.postDetPedido({
        cantidad: Number,
        pedido_id: pedido._rawValue.value,
        producto_id: producto._rawValue.value,

      });
      cancelShow();
      greatMessage.value = "Ticket Agregado";
      generarTicket();
      showGreat();
      generarListaAsientos()
    } catch (error) {
      console.log(error);
      cancelShow();
      badMessage.value = error.response.data.error.errors[0].msg;
      showBad();
    };
  } else {
    cancelShow();
    badMessage.value = "Agrega un Cliente"
    showBad();
  };
};

/* const agregarDetallePedido = (producto, cantidad) => {
  if (!producto || !cantidad) {
    notificar('negative', 'Por favor seleccione un producto y una cantidad.');
    return;
  }

  const newRow = {
    cantidad,
    pedido_id: dataPedido.value._id,
    producto_id: producto._id,
    producto_nombre: producto.nombre,
  };

  rows.value.push(newRow);

  // Limpiar los campos del modal después de agregar una nueva fila
  data.value.cantidad = '';
  data.value.producto_id = '';

  notificar('positive', 'Detalle de pedido agregado exitosamente.');
}; */

const obtenerFicha = async () => {
  try {
    const ficha = await fichaStore.obtenerInfoFichas();
    const fichaAct = ficha.filter(fichas => fichas.status === "1")
    console.log("fichas activas", fichaAct);
    seletFicha.value = fichaAct.map((items) => ({
      label: `${items.codigo_ficha}`,
      value: String(items._id)
    }));
    sortBy(seletFicha.value, 'label');
  } catch (error) {
    console.error(error);
  }
}

obtenerFicha();

const obtenerUsuarios = async () => {
  try {
    const usuario = await usuarioStore.obtenerInfoUsuarios();
    const usuarioAct = usuario.filter(usuarios => usuarios.status === "1")
    const instructores = usuarioAct.filter(usuario => usuario.rol.toLowerCase() === "instructor");
    console.log("usuarios activos", usuarioAct);
    console.log("instuctores", instructores);
    seletusuario.value = usuarioAct.map((items) => ({
      label: `${items.nombre}+${items.rol}`,
      value: String(items._id)
    }));
    sortBy(seletusuario.value, 'label');
  } catch (error) {
    console.error(error);
  }
}

obtenerUsuarios();

function notificar(tipo, mensaje) {
  console.log(`Tipo de notificación: ${tipo}, Mensaje: ${mensaje}`);
}


/* function validarCamposPedidos() {
    const arrData = Object.entries(dataPedido.value);

    for (const item of arrData) {
        const key = item[0];
        const value = item[1];

        if (!value || value.trim() === "") {
            notificar('negative', "Por favor complete todos los campos");
            return;
        }

        if (key === "fecha_pedido" && value.toString().length < 1) {
            notificar('negative', "La fecha de pedido es obligatoria");
            return;
        }

        if (key === "fecha_entrega" && value.toString().length < 1) {
            notificar('negative', "La fecha de entrega es obligatoria");
            return;
        }

        if (key === "usuario" && value.toString().length < 1) {
            notificar('negative', 'El usuario es obligatorio');
            return;
        }

        if (key === "ficha" && value.toString().length < 1) {
            notificar('negative', "La ficha es obligatoria");
            return;
        }
    }

    enviarInfoestado.value = true;
} */
function validarCampo(campo, valor, mensaje) {
    if (!valor || valor.trim() === "") {
        Notify.create({
            type: 'negative',
            message: mensaje,
        });
        return false; // Indica que el campo no es válido
    }
    return true; // Indica que el campo es válido
}

// Función para validar todos los campos
function validarCamposPedidos() {
    // Validar que ningún campo quede sin completar
    if (!data.fecha_pedido || !data.fecha_entrega || !data.usuario || !data.ficha) {
        notificar('negative', 'Por favor complete todos los campos.');
        return;
    }

    if (data.usuario === 'Seleccionar') {
        notificar('negative', 'Por favor seleccione un usuario válido.');
        return;
    }

    // Ejemplo de validación de ficha
    if (data.ficha === 'Seleccionar') {
        notificar('negative', 'Por favor seleccione una ficha válida.');
        return;
    }

    // Realizar la acción necesaria si todos los campos son válidos
    enviarInfoestado.value = true;
}



const enviarInfoPedido = {
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
      showDetalleDiv.value = true;
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



const obtenerInfo = async () => {
  try {
    // Esperar a que se completen todas las promesas
    await Promise.all([obtenerProducto(), obtenerFicha(), obtenerUsuarios()]);

    const detPedido = await detPedidoStore.obtenerInfodetPedido();
    console.log("detPedidoStore")
    console.log(detPedidoStore)
    console.log("dentro")
    console.log(detPedido);

    if (!detPedido) return

    if (detPedido.error) {
      notificar('negative', detPedido.error)
      return
    }
    rows.value = detPedido.Det_pedido


  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

obtenerInfo();


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
