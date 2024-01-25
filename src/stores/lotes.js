/* import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useLoteStore = defineStore('lote', () => {
    const lotes = ref([]);

    const obtenerInfoLotes = async () => {
        try {
            let responseLotes = await axios.get('lote/ver');
            lotes.value = responseLotes.data.lotes; 
        } catch (error) {
            throw error
        }
    };

    const postLotes = async (data) =>{
        try {
            let res = await axios.post("lote/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putLote = async (id, data) => {
        try {
            let res = await axios.put(`lote/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`lote/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`lote/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del bus");
        }
    }

    return {
        lotes,
        obtenerInfoLotes, postLotes, putLote, putInactivar, putActivar
    };
}); */