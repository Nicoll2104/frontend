import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useAreaStore = defineStore('area', () => {
    const area = ref([]);

    const obtenerInfoAreas = async () => {
        try {
            let responseAreas = await axios.get('area_tematica/ver');
            return responseAreas.data;
        } catch (error) {
            throw error;
        }
    };

    const postArea = async (data) =>{
        try {
            let res = await axios.post("area_tematica/agregar", data);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    };

    const putArea = async (id, data) => {
        try {
            let res = await axios.put(`area_tematica/modificar/${id}`, data);
            return res;
        } catch (error) {
            return error.response.data;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`area_tematica/inactivar/${id}`);
            return res;
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la área");
        }
    };

    const putActivar = async (id)=>{
        try {
            let res = await axios.put(`area_tematica/activar/${id}`);
            return res;
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la área");
        }
    };

    return {
        area,
        obtenerInfoAreas,
        postArea,
        putArea,
        putInactivar,
        putActivar
    };
});
