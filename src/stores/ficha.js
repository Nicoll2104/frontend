import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useFichaStore = defineStore('ficha', () => {
    const fichas = ref([]);

    const obtenerInfoFichas = async () => {
        try {
            let responFichas = await axios.get('ficha/ver');
            console.log (responFichas);
            // lotes.value = responseLotes.data; 
            return responFichas.data
            console.log(lotes)
        } catch (error) {
            throw error
        }
    };

    const postLotes = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("lote/agregar", data);
            console.log('a', res);
            return res.data.lotes
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
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`lote/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }

    return {
        fichas,
        obtenerInfoFichas, postLotes, putLote, putInactivar, putActivar
    };
});