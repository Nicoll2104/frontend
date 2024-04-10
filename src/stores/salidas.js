import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useSalidaStore = defineStore('salida', () => {
    const salidas = ref([]);

    const obtenerInfoSalidas = async () => {
        try {
            let responseSalidas = await axios.get('salida/ver');
            return responseSalidas.data;
        } catch (error) {
            throw error;
        }
    };

    const postsalida = async (data) =>{
        try {
            let res = await axios.post("salida/agregar", data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    };

    const putsalida = async (id, data) => {
        try {
            let res = await axios.put(`salida/modificar/${id}`, data);
            return res;
        } catch (error) {
            return error.response.data;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`salida/inactivar/${id}`);
            return res;
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la salida");
        }
    };

    const putActivar = async (id)=>{
        try {
            let res = await axios.put(`salida/activar/${id}`);
            return res;
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la salida");
        }
    };

    return {
        salidas,
        obtenerInfoSalidas,
        postsalida,
        putsalida,
        putInactivar,
        putActivar
    };
});
