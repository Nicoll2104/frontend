import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useRedConocimientoStore = defineStore('redConomiento', () => {
    const RedConoc = ref([]);

    const obtenerInfoRedCon = async () => {
        try {
            let responseRedConomiento = await axios.get('redConomiento/ver');

            // lotes.value = responseLotes.data; 
            return responseRedConomiento.data
            console.log(RedConoc)
        } catch (error) {
            throw error
        }
    };

    const  postRedcon = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("redConomiento/agregar", data);
            console.log('a', res);
            return res.data.RedConoc
        } catch (error) {
            throw error
        }
    }

    const putRedcon = async (id, data) => {
        try {
            let res = await axios.put(`redConomiento/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`redConomiento/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`redConomiento/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del lote");
        }
    } 

    return {
        RedConoc,
        obtenerInfoRedCon,  postRedcon, putRedcon, putInactivar, putActivar
    };
});