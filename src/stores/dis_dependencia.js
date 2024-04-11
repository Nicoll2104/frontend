import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDistDependStore = defineStore('DistDependencia', () => {
    const disDependencias = ref([]);

    const obtenerInfoDepend = async () => {
        try {
            let responseDepend = await axios.get('disDependencia/ver');
            // lotes.value = responseLotes.data; 
            return responseDepend.data
            console.log(disDependencias)
        } catch (error) {
            throw error
        }
    };

    const postDepend = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("disDependencia/agregar", data);
            console.log('a', res);
            return res.data.dep
        } catch (error) {
            throw error
        }
    }

    const putDepend = async (id, data) => {
        try {
            let res = await axios.put(`disDependencia/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`disDependencia/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`disDependencia/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }

    return {
        useDistDependStore,
        obtenerInfoDepend, postDepend, putDepend, putInactivar, putActivar
    };
});