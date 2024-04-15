import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import Cookies from "js-cookie";
import { ref } from "vue";

export const useUsuarioStore = defineStore("usuario", () => {

  const sesion = ref({})


  const obtenerInfoUsuarios = async () => {
    try {
      let responseUsuarios = await axios.get("usuario/ver");
      return responseUsuarios.data;
    } catch (error) {
      throw error;
    }
  };

  const postUsuarios = async (data) =>{
    try {
        let res = await axios.post("usuario/agregar", data);
        return res.data
    } catch (error) {
        return error.response.data
    }
}

const putUsuario = async (id, data) => {
  try {
      let res = await axios.put(`usuario/modificar/${id}`, data);
      return res
  } catch (error) {
      return error.response.data;
  }
};

const putInactivar = async (id)=>{
  try {
      let res = await axios.put(`usuario/inactivar/${id}`)
      return res
  } catch (error) {
      console.log(error, "Error al cambiar el estado del usuario");
  }
}
const  putActivar = async (id)=>{
  try {
      let res = await axios.put(`usuario/activar/${id}`)
      return res
  } catch (error) {
      console.log(error, "Error al cambiar el estado del usuario");
  }
}

  const model = "usuario/";
  const router = useRouter();
  const $q = useQuasar();

  function solicitarToken() {
    const token = Cookies.get("x-token");

    console.log(token);
    if (token == "null") {
      console.log("h");
      notificar("Por favor inicie sesión");
      router.push("/");
      return false;
    }

    return token;
  }

  function notificar(msg) {
    $q.notify({
      type: "negative",
      message: msg,
      position: "top",
    });
  }

  function insertarToken() {
    const token = solicitarToken();

    if (!token) return false;

    const axiosInstance = axios.create({
      headers: {
        "x-token": token,
      },
    });

    return axiosInstance;
  }

  function salir() {
    notificar("Por favor vuelva a iniciar sesión");
    router.push("/");
  }

  const obtener = async () => {
    try {
      const x = insertarToken();
      if (!x) return null;
      const response = await x.get(`${model}all`);
      return response.data;
    } catch (error) {
      console.error(error);
      if (error.message === "Network Error") {
        notificar("Sin conexión, por favor intente recargar");
        return null;
      }

      if (error.response.data.error === "Token no valido") {
        salir();
      }
      return error.response.data;
    }
  };
  
    const login = async (data) => {
      try {
        console.log('prosesando solicitud en js..')
        const response = await axios.post(`${model}login`, {
          "id":data._id,
          "nombre":data.nombre,
          "cedula":data.cedula,
          "correo":data.correo,
          "telefono":data.telefono,
          "contrasena":data.contrasena,
          "rol":data.rol
        });
        sesion.value = response.data

        console.log('sesion:',response)
  
        Cookies.set('rol', response.data.usuarios.rol, {expires:1})
        return response;

      } catch (error) {
        console.log(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
          return null;
        }
        return error.response.data;
      }
    };

    const recuperar = async (correo) => {
      try {
        const response = await axios.get(`${model}recuperar/${correo}`);
        console.log(response);
        return response;
      } catch (error) {
        console.error(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
          return null;
        }
  
        if (error.response.data.error === "Token no valido") {
          salir();
        }
        return error.response.data;
      }
    };

    const codigo = async (codigo) => {
      try {
        const response = await axios.get(`${model}codigo/${codigo}`);
        return response;
      } catch (error) {
        console.error(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
          return null;
        }
  
        if (error.response.data.error === "Token no valido") {
          salir();
        }
        return error.response.data;
      }
    };

    const nuevacontrasena = async (info) => {
      try {
        const response = await axios.put(`${model}nuevacontrasena`, info);
        return response;
      } catch (error) {
        console.error(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
          return null;
        }
  
        if (error.response.data.error === "Token no valido") {
          salir();
        }
        return error.response.data;
      }
    };

  return {
    sesion,
    obtenerInfoUsuarios,
    obtener,
    postUsuarios,
    putUsuario,
    putInactivar,
    putActivar,
    login,
    recuperar,
    codigo,
    nuevacontrasena
  }
},{
  persist: true
});
