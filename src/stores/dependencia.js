import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDependStore = defineStore('dependencia', () => {
    const dependencias = ref([]);

    const obtenerInfoDepend = async () => {
        try {
            let responseDepend = await axios.get('dependencia/ver');
            console.log (responseDepend);
            // lotes.value = responseLotes.data; 
            return responseDepend.data
            console.log(dependencias)
        } catch (error) {
            throw error
        }
    };

    const postDepend = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("dependencia/agregar", data);
            console.log('a', res);
            return res.data.dep
        } catch (error) {
            throw error
        }
    }

    const putDepend = async (id, data) => {
        try {
            let res = await axios.put(`dependencia/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`dependencia/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`dependencia/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del presupuesto");
        }
    }

    return {
        dependencias,
        obtenerInfoDepend, postDepend, putDepend, putInactivar, putActivar
    };
});