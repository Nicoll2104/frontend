<template>
  <div>
    <q-dialog v-model="modal" persistent color="primary">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title> Agregar / Editar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />

        </q-toolbar>
        <!-- inputs🃏👇-->
        <q-card-section class="q-gutter-md row items-star justify-center continputs1">
            <q-input class="nombreinput modalinputs" outlined v-model="data.fecha_creacion" label="Fecha de creación" type="date" maxlength="15" lazy-rules
            :rules="[val => validateDate(val) || 'Ingrese la fecha de creación']" readonly/>
            <q-input class="nombreinput modalinputs" outlined v-model="data.fecha_entrega" label="Fecha de entrega" type="date" maxlength="15" lazy-rules
            :rules="[val => validateDate(val) || 'Ingrese la fecha de entrega']"/>
            <q-select class="nombreinput modalinputs" outlined v-model="data.completado" label="Completado SI o NO" 
            :options="seletcompletado" lazy-rules :rules="[val => val.trim() != '' || 'selecione si o no']"/>
            <q-select class="nombreinput modalinputs" outlined v-model="data.destino" label="Seleccione el destino"
            :options="seletDestino" lazy-rules :rules="[val => val.trim() != '' || 'selecione el destino']"/>
            <q-select class="nombreinput modalinputs" outlined v-model="data.instructor_encargado" label="Seleccione el instructor" 
            :options="seletInstructor" lazy-rules :rules="[val => val.trim() != '' || 'selecione el instructor']"/>
            <q-input class="nombreinput modalinputs" outlined v-model="data.total" label="total" type="number" maxlength="15" lazy-rules
            :rules="[val => val.trim() != '' || 'selecione el destino']"/>
          </q-card-section>
        <!-- inputs🃏☝ -->
        <!-- btns 🛑👇 -->
        <q-card-section class="q-gutter-md row items-end justify-end continputs1">
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px" color="secondary" label="guardar">
            <q-icon name="style" color="white" right />
          </q-btn>

          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white" v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>

          <div>
    <q-select
      filled
      v-model="data2.idProducto"
      :options="seletProducto"
      label="Seleccione el producto"
      class="q-mx-auto"
      style="width: 300px"
    />
    <q-input class="modalinputs" outlined v-model="data2.cantidad" label="Cantidad" type="number" maxlength="15"
      lazy-rules :rules="[(val) => val.trim() != '' || 'Ingrese una cantidad']"></q-input>

    <q-btn @click="guardar" :loading="loadingmodal" padding="10px" color="secondary" label="Guardar">
      <q-icon name="style" color="white" right />
    </q-btn>

    <q-table
      :rows="tablaProductos"
      :columns="columnasTabla"
    />
  </div>

        </q-card-section>
        <!-- btns 🛑☝ -->
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <q-table dense :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
        rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la busqueda" >
        <template v-slot:top>
          <h4 class="titulo-cont">
            {{ modelo + ' ' }}
            <q-btn @click="opciones.agregar" label="Crear Pedido" color="secondary">
            <q-icon name="add_circle" color="white" right />
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

        <template v-slot:body-cell-opciones="props">
        <q-td :props="props" class="botones" auto-width>
          
          <q-btn color="warning" icon="edit" class="text-caption q-pa-sm q-ma-xs" @click="opciones.editar(props.row)" />
 
          <q-btn color="secondary" icon="zoom_in" class="text-caption q-pa-sm q-ma-xs" @click="mostrarModal()" />

        
            <q-dialog v-model="showModal" persistent>
      <q-card class="modal">
        <q-toolbar class="q-pr-xl q-pl-xl">
          <q-toolbar-title class="text-h5">Agregar/Modificar {{ modelo }}</q-toolbar-title>
          <q-btn class="botonv1" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md row items-star justify-center continputs1">
          <q-input class="modalinputs" outlined v-model="data.cantidad" label="Cantidad" type="number" maxlength="15"
            lazy-rules :rules="[(val) => val.trim() != '' || 'Ingrese una cantidad']"></q-input>

          <q-select filled v-model="data.producto_id" :options="seletProducto" label="Seleccione el producto"
            class="q-mx-auto" style="width: 300px" />
        </q-card-section>

        <q-input class="modalinputs" outlined v-model="data.subtotal" label="Subtotal" type="number" maxlength="15"
          lazy-rules :rules="[(val) => val.trim() != '' || 'Ingrese una cantidad']"></q-input>

        <q-card-section class="q-gutter-md row items-end justify-end continputs1" style="margin-top: 0">
          <q-btn @click="validarCampos" :loading="loadingmodal" padding="10px"
            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            <q-icon :name="estado == 'editar' ? 'edit' : 'style'" color="white" right />
          </q-btn>
          <q-btn :loading="loadingmodal" padding="10px" color="warning" label="cancelar" text-color="white"
            v-close-popup>
            <q-icon name="cancel" color="white" right />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
        </q-td>
      </template>
      <div class="show-p" v-if="props.row.detalle">
</div>

      </q-table>

    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { usePedidoStore } from "../stores/pedido.js";
import { useDestinoStore } from "../stores/destino.js";
import { useUsuarioStore } from "../stores/usuario.js";
import { usedetPedidoStore } from "../stores/det_pedido.js";
import { useProductoStore } from "../stores/producto.js";
import { date, useQuasar } from 'quasar'

const modelo = "Pedidos";
const usePedido = usePedidoStore();
const useDestino = useDestinoStore();
const useUsuario = useUsuarioStore();
const useDetPedido = usedetPedidoStore();
const useProductos = useProductoStore();
const loadingTable = ref(true)
const $q = useQuasar()
const filter = ref("");
const loadingmodal = ref(false);
const showModal = ref(false);
const tablaProductos = ref([]);



const columns = ref([
  {
    name: "fecha_creacion",
    label: "Fecha creacion",
    align: "left",
    field: (row) => row.fecha_creacion.slice(0, -14),
    sort: true,
    sortOrder: "da",
  },
  {
    name: "fecha_entrega",
    label: "Fecha entrega",
    align: "left",
    field: (row) => row.fecha_entrega.slice(0, -14),
    sort: true,
    sortOrder: "da",
  },
  {
    name: "completado",
    label: "Completado",
    align: "left",
    field: (row) => row.completado==!'true'?'no': 'si',
  },
  {
    name: "destino",
    label: "Destino",
    align: "left",
    field: (row) => row.destino.nombre,
  },
  {
    name: "instructor_encargado",
    label: "Instructor",
    align: "center",
    field: (row) => row.instructor_encargado.nombre,
  },
  {
    name: "total",
    label: "Total",
    align: "center",
    field: (row) => row.total,
  },
  {
    name: "opciones",
    label: "",
    field: "opciones",
    align: "center",
  },
]);


const mostrarModal = () => {
  showModal.value = true;
};

const data2 = ref({
  idProducto: null,
  cantidad: null
});

const columnasTabla = [
  { name: 'nombre', align: 'left', label: 'Producto', field: row => row.nombre },
  { name: 'cantidad', align: 'left', label: 'Cantidad', field: 'cantidad' }
];

const guardar = () => {
  if (data2.value.idProducto && data2.value.cantidad) {
    tablaProductos.value.push({
      nombre: seletProducto.value.find(producto => producto.value === data2.value.idProducto).label,
      cantidad: data2.value.cantidad
    });

    data2.value.idProducto = null;
    data2.value.cantidad = null;
  }
};


const rows = ref([]);
const rowsPedido = ref([])
const data = ref({
  fecha_creacion: "",
  fecha_entrega: "",
  completado: "",
  destino: "",
  instructor_encargado: "",
  total: "",
});


let seletDestino = ref([]);
let seletInstructor = ref([]);
let seletProducto = ref([]);
let seletcompletado = ref([
  {
  label: 'Si',
  value: true
},
{
  label: 'No',
  value: false
},
])


const obtenerProducto = async () => {
try {
  const producto = await useProductos.obtenerInfoProducto();
  console.log("Todos los productos:", producto);

  seletProducto.value = producto.map((producto_id) => ({
    label: `${producto_id.nombre}`,
    value: String(producto_id._id),
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

const obtenerDestino = async () => {
try {
  const res = await useDestino.obtenerInfoDestinos();
  const destinos = res.destinos
  console.log("Todos los Destinos:", destinos);

  seletDestino.value = destinos.map((destino) => ({
    label: `${destino.nombre}`,
    value: String(destino._id),
  }));

  seletDestino.value.sort((a, b) => {
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

const obtenerUsuario = async () => {
try {
  const usuario = await useUsuario.obtenerInfoUsuarios();
  console.log("Todos los Instructores:", usuario);

  seletInstructor.value = usuario.map((instructor_encargado) => ({
    label: `${instructor_encargado.nombre}`,
    value: String(instructor_encargado._id),
  }));

  seletInstructor.value.sort((a, b) => {
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



/* const preciototal = data.cantidad * data.precioporunidad; */

const obtenerInfo = async () => {
  try {
    await Promise.all([obtenerDestino(), obtenerUsuario(), ]);
    const pedidos = await usePedido.obtenerInfoPedido();

    console.log(pedidos);

    if (!pedidos) return

    if (pedidos.error) {
      notificar('negative', pedidos.error)
      return
    }
    rows.value = pedidos;

  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false
  }
};

obtenerInfo();

/* const obtenerInfo2 = async () => {
try {
  await Promise.all([obtenerProducto()]);
  const res = await useDetPedido.obtenerInfodetPedido();
  const detPedido = res.Det_pedido
  console.log("detaleeeeeee");
  console.log(detPedido);

  if (!detPedido) return;

  if (detPedido.error) {
    notificar("negative", detPedido.error);
    return;
  }
 
  rowsPedido.value = detPedido;

for (let i = 0; i < rowsPedido.value.length; i++) {
if (!rowsPedido.value[i].Det_pedido) {
  continue;
}

console.log(i);
const Index = rowsPedido.value.findIndex(objeto => objeto._id === rowsPedido.value[i].Det_pedido._id);
console.log(Index)
if (Index !== -1) {
rowsPedido.value[Index].detalle = rowsPedido.value[i];
}

}
} catch (error) {
  console.error(error);
} finally {
  loadingTable.value = false;
}
};


obtenerInfo2();
 */
/*  const buscarDetallesPedido = () => {
  if (pedidoSeleccionado.value) {
    obtenerInfo2(); // Llama a la función para obtener los detalles del pedido
    showModal.value = true; // Muestra el modal
  }
}; */

 const obtenerInfo2 = async () => {
  try {
    await Promise.all([obtenerProducto()]);
    const res = await useDetPedido.obtenerInfodetPedido();
    const detPedido = res.Det_pedido;
    console.log("detaleeeeeee");
    console.log(detPedido);

    if (!detPedido) return;

    if (detPedido.error) {
      notificar("negative", detPedido.error);
      return;
    }

    rowsPedido.value = detPedido;

    for (let i = 0; i < rowsPedido.value.length; i++) {
      if (!rowsPedido.value[i].Det_pedido) {
        continue;
      }

      console.log(i);
      const Index = rowsPedido.value.findIndex(
        (objeto) => objeto._id === rowsPedido.value[i].Det_pedido._id
      );
      console.log(Index);
      if (Index !== -1) {
        rowsPedido.value[Index].detalle = rowsPedido.value[i];
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
};






function fechahoy() {
  var fechaDeHoy = new Date();
  var año = fechaDeHoy.getFullYear();
  var mes = ('0' + (fechaDeHoy.getMonth() + 1)).slice(-2); // Agrega ceros a la izquierda si el mes es menor a 10
  var dia = ('0' + fechaDeHoy.getDate()).slice(-2); // Agrega ceros a la izquierda si el día es menor a 10
  return año + '-' + mes + '-' + dia;
}

const estado = ref("guardar");
const modal = ref(false);
const opciones = {
  agregar: () => {
    data.value = {
      fecha_creacion: fechahoy(),
      fecha_entrega: "",
      completado: "",
      destino: "",
      instructor_encargado: "",
      total: "",
    };
    modal.value = true;
    estado.value = "guardar";
  },
  editar: (info) => {
    data.value = {
      ...info,
      completado: info.completado? {label: 'Si',value: true}:{label: 'No',value: false} ,
      destino: {label: info.destino.nombre,value: info.destino}, // Asignar solo el ID del destino
      instructor_encargado: {label: info.instructor_encargado.nombre ,value: info.instructor_encargado} , // Asignar solo el ID del instructor
      fecha_creacion: info.fecha_creacion.slice(0, -14), // Mantener la fecha completa
      fecha_entrega: info.fecha_entrega.slice(0, -14), // Mantener la fecha completa
    };
    modal.value = true;
    estado.value = "editar";
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}

const validateDestino = (value) => {
if (!value) {
  return "Seleccione una ficha o proyecto";
}

return true;
};
const enviarInfo = {
  guardar: async () => {
    loadingmodal.value = true;
    try {
      const info = { ...data.value, instructor_encargado: data.value.instructor_encargado.value, destino:data.value.destino.value, completado: data.value.completado.value };
      const response = await usePedido.postPedido(info);
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
      console.log('---------------------')
      console.log('peticion para editar:')
      console.log({
        ...data.value,
        completado: data.value.completado.value ,
        destino: {...data.value.destino.value},
        instructor_encargado: {...data.value.instructor_encargado.value}, 
      })
      const response = await usePedido.putPedido(data.value._id, {
        ...data.value,
        completado: data.value.completado.value ,
        destino: {...data.value.destino.value},
        instructor_encargado: {...data.value.instructor_encargado.value}, 
      });
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error);
        loadingmodal.value = false;
        return;
      }
      const index = rows.value.findIndex((pedido) => pedido._id === response._id);
      rows.value.splice(index, 1, response);
      notificar('positive', 'Editado exitosamente');
      modal.value = false;
    } catch (error) {
      console.log(error);
      if (error.response){
        if (error.response.data){
          notificar('negative', error.response.data.error)
        }
      }
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

function validarCampos() {

  const destinoValidation = validateDestino(data.value.destino);
  const arrData = Object.entries(data.value)
  for (const d of arrData) {
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

    if (d[0] === "fecha_creacion" && d[1].toString().length < 1) {
      notificar('negative', "La fecha de creacion es obligatoria")
      return
    }
    if (d[0] === "fecha_entrega" && d[1].toString().length < 1) {
      notificar('negative', "La fecha de entrega es obligatoria")
      return
    }
    if (d[0] === "instructor_encargado" && d[1].toString().length < 1) {
      notificar('negative', "El instructor encargado es obligatorio")
      return
    }
    if (d[0] === "total" && d[1].toString().length < 1) {
      notificar('negative', "El total es obligatorio")
      return
    }

    if (d[0] === "destino" && d[1].toString().length < 8) {
      notificar('negative', "La ficha o el contrato es obligatorio")
      return
    }

    if (d[0] === "email" && !d[1].includes('@')) {
      notificar('negative', 'Email no válido')
      return
    }
    if (destinoValidation !== true) {
      $q.notify({ type: "negative", message: destinoValidation });
      return;
    }

    if (data.value.fecha_creacion.length > 10 || data.value.fecha_entrega.length > 10){
    notificar('negative', 'la fecha no es valida')
      return
  }
  

  if ( new Date(data.value.fecha_creacion) >= new Date(data.value.fecha_entrega) ) {
    notificar('negative', 'la fecha de entrega debe ser despues de la fecha de creacion')
      return
  } 
  }
  enviarInfo[estado.value]()
}

function validateDate (value) {
  if (!value) {return 'ingrese una fecha'}
  if (value.length > 10){return `la fecha no es valida`;}
  if ( new Date(data.value.fecha_creacion) > new Date(data.value.fecha_entrega) ) {
    return `la fecha de inicio debe ser antes de la fecha de cierre`;
  } 
  return true;
  }

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top"
  })
}

function prompt() {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
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

.continputs1 {
  border-top: solid 1px rgba(0, 0, 0, 0.212);
  margin-top: 2px;
}

.modalinputs {
  width: 400px;
  max-width: 80%;
}

.descripcioninput {
  width: 100%;
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
</style>