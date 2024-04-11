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
              :rules="[val => val.trim() != '' || 'Ingrese la fecha de creación']"></q-input>
              <q-input class="nombreinput modalinputs" outlined v-model="data.fecha_entrega" label="Fecha de entrega" type="date" maxlength="15" lazy-rules
              :rules="[val => val.trim() != '' || 'Ingrese la fecha de entrega']"></q-input>
              <q-select filled v-model="data.completado" :options="seletcompletado" label="Completado SI o NO" class="q-mx-auto" style="width: 300px"/>
              <q-select filled v-model="data.destino" :options="seletDestino" label="Seleccione el destino" class="q-mx-auto" style="width: 300px"/>
              <q-select filled v-model="data.instructor_encargado" :options="seletInstructor" label="Seleccione el instructor" class="q-mx-auto" style="width: 300px"/>
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
  
          </q-card-section>
          <!-- btns 🛑☝ -->
        </q-card>
      </q-dialog>
  
      <div class="q-pa-md">
        <q-table dense :rows="rows" :columns="columns" class="tabla" row-key="name" :loading="loadingTable" :filter="filter"
          rows-per-page-label="visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
          no-results-label="No hay resultados para la busqueda" wrap-cells="false">
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
  
   <!--        <template v-slot:body-cell-Estado="props">
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
          </template> -->
  
          <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones" auto-width>
            
            <q-btn color="warning" icon="edit" class="text-caption q-pa-sm q-ma-xs" @click="opciones.editar(props.row)" />
            
            <router-link to="/det_pedido" class="ingresarcont">
              <q-btn color="secondary" icon="zoom_in" class="text-caption q-pa-sm q-ma-xs" />
            </router-link>

          </q-td>
        </template>
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
  import { useQuasar } from 'quasar'
  
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
  
  const rows = ref([]);
  
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

  const obtenerInfo2 = async () => {
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
    /* rows.value = detPedido; */

/* for (let i = 0 ; i < detPedido.length; i++) {
  if (!detPedido[i]) continue;
  const pedido = rows.value.find((p) => p._id === detPedido[i].pedido);
  console.log("Pedido encontrado", pedido);
  if (!pedido) continue;
  if (!pedido.detalle) {
    pedido.detalle = [];
  }
  pedido.detalle.push(detPedido[i]);
}

 */ 
  } catch (error) {
    console.error(error);
  } finally {
    loadingTable.value = false;
  }
};


obtenerInfo2();
  
  const estado = ref("guardar");
  const modal = ref(false);
  const opciones = {
    agregar: () => {
      data.value = {
        fecha_creacion: "",
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
  // Asignar la fecha completa al objeto data.value
      data.value = {
        ...info,
        destino: info.destino._id, // Asignar solo el ID del destino
        instructor_encargado: info.instructor_encargado._id, // Asignar solo el ID del instructor
        fecha_creacion: info.fecha_creacion, // Mantener la fecha completa
        fecha_entrega: info.fecha_entrega, // Mantener la fecha completa
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
        const info = { ...data.value, destino: data.value.destino.value };
        const response = await usePedido.postPedido (info);
        console.log(response);
        if (!response) return
        if (response.error) {
          notificar('negative', response.error)
          loadingmodal.value = false;
          return
        }
  
        rows.value.unshift(response.destino);
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
        const response = await usePedido.editar(data.value._id, {
          ...data.value,
          destino: data.value.destino,
          instructor_encargado: data.value.instructor_encargado,
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