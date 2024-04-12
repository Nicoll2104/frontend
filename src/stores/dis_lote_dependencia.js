import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDistLoteDependStore = defineStore('DistDependencia', () => {
    const dislotedepens = ref([]);

    const obtenerInfoDepend = async () => {
        try {
            let responseDepend = await axios.get('dislotedepen/ver');
            // lotes.value = responseLotes.data; 
            return responseDepend.data
            console.log(dislotedepens)
        } catch (error) {
            throw error
        }
    };

    const postDepend = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("dislotedepen/agregar", data);
            console.log('a', res);
            return res.data.dep
        } catch (error) {
            throw error
        }
    }

    const putDepend = async (id, data) => {
        try {
            let res = await axios.put(`dislotedepen/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`dislotedepen/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`dislotedepen/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }

    return {
        useDistLoteDependStore,
        obtenerInfoDepend, postDepend, putDepend, putInactivar, putActivar
    };
});