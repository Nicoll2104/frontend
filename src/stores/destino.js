import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDestinoStore = defineStore('destino', () => {
    const Destinos = ref([]);

    const obtenerInfoDestinos = async () => {
        try {
            let responseDestinos = await axios.get('destino/ver');

            // Destinos.value = responseDestinos.data; 
            return responseDestinos.data
            console.log(Destinos)
        } catch (error) {
            throw error
        }
    };

    const postDestinos = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("destino/agregar", data);
            console.log('a', res);
            return res.data.Destinos
        } catch (error) {
            throw error
        }
    }

    const putDestino = async (id, data) => {
        try {
            let res = await axios.put(`destino/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`destino/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del Destino");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`destino/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del Destino");
        }
    }

    return {
        Destinos,
        obtenerInfoDestinos, postDestinos, putDestino, putInactivar, putActivar
    };
});