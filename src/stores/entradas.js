import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useEntradaStore = defineStore('entrada', () => {
    const entradas = ref([]);

    const obtenerInfoEntradas = async () => {
        try {
            let responseEntradas = await axios.get('entrada/ver');
            console.log (responseEntradas);
            // lotes.value = responseLotes.data; 
            return responseEntradas.data
            console.log(lotes)
        } catch (error) {
            throw error
        }
    };

    const postEntrada = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("entrada/agregar", data);
            console.log('a', res);
            return res.data.entrd
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    const putEntrada = async (id, data) => {
        try {
            let res = await axios.put(`entrada/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`entrada/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la entrada");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`entrada/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la entrada");
        }
    }

    return {
        entradas,
        obtenerInfoEntradas, postEntrada, putEntrada, putInactivar, putActivar
    };
});