import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useContratoStore = defineStore('contrato', () => {
    const contratos = ref([]);

    const obtenerInfoContrato = async () => {
        try {
            let responseContrato = await axios.get('contrato/ver');


            // lotes.value = responseLotes.data; 
            return responseContrato.data
        } catch (error) {
            throw error
        }
    };

    const postContrato = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("contrato/agregar", data);
            console.log('a', res);
            return res.data.contratos
        } catch (error) {
            throw error
        }
    }

    const putContrato = async (id, data) => {
        try {
            let res = await axios.put(`contrato/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`contrato/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del contrato");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`contrato/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del contrato");
        }
    }

    return {
        contratos,
        obtenerInfoContrato, postContrato, putContrato, putInactivar, putActivar
    };
});