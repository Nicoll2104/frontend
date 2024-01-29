 import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAreaStore = defineStore('area', () => {
    const areas = ref([]);

    const getArea = async () => {
        try {
            let responseAreas = await axios.get('area/ver');
            areas.value = responseAreas.data.area; 
        } catch (error) {
            throw error
        }
    };

    const postArea = async (data) =>{
        try {
            let res = await axios.post("area/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putArea = async (id, data) => {
        try {
            let res = await axios.put(`area/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`area/inactivar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la area");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let res = await axios.put(`area/activar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la area");
        }
    }

    return {
        areas,
        getArea, postArea, putArea, putInactivar, putActivar
    };
}); 