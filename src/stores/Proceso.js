import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProcesoStore = defineStore('proceso', () => {
    const procesos = ref([]);

    const obtenerInfoProceso = async () => {
        try {
            let responseProceso = await axios.get('proceso/ver');
            console.log (responseProceso);
            // lotes.value = responseLotes.data; 
            return responseProceso.data
            console.log(procesos)
        } catch (error) {
            throw error
        }
    };

    const postProceso = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("proceso/agregar", data);
            console.log('a', res);
            return res.data.Procesos
        } catch (error) {
            return error.response.data;
        }
    }

    const putProceso = async (id, data) => {
        try {
            let res = await axios.put(`proceso/modificar/${id}`, data);
            return res
        } catch (error) {
            return error.response.data;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`proceso/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del proceso");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`proceso/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del proceso");
        }
    } 

    return {
        procesos,
        obtenerInfoProceso, postProceso, putProceso, putInactivar, putActivar
    };
});