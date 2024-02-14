/* import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDisFichaStore = defineStore('disFicha', () => {
    const disFicha = ref([]);

    const obtenerInfoDisFicha = async () => {
        try {
            let responseDisFicha = await axios.get('disFicha/ver');
            disFicha.value = responseDisFicha.data.disFicha; 
        } catch (error) {
            throw error
        }
    };

    const postDisFicha = async (data) =>{
        try {
            let res = await axios.post("disFicha/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putDisFicha = async (id, data) => {
        try {
            let res = await axios.put(`disFicha/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`disFicha/inactivar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de la ficha");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let res = await axios.put(`disFicha/activar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de la ficha");
        }
    }

    return {
        disFicha,
        obtenerInfoDisFicha, postDisFicha, putDisFicha, putInactivar, putActivar
    };
});  */
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useDisFichaStore = defineStore('disFicha', () => {
    const disFichas = ref([]);

    const obtenerInfoDisFicha = async () => {
        try {
            let responsedisFicha = await axios.get('disFicha/ver');
            // lotes.value = responseLotes.data; 
            return responsedisFicha.data
            console.log(disFichas)
        } catch (error) {
            throw error
        }
    };

 const postDisFicha = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("disFicha/agregar", data);
            console.log('a', res);
            return res.data.disFichas
        } catch (error) {
            throw error
        }
    }

    const putDisFicha = async (id, data) => {
        try {
            let res = await axios.put(`disFicha/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`disFicha/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de la ficha");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`disFicha/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de la ficha");
        }
    }

    return {
        disFichas,
        obtenerInfoDisFicha, postDisFicha, putDisFicha, putInactivar, putActivar
    };
});