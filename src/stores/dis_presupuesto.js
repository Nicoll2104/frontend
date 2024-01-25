/* import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usedisPresupuesStore = defineStore('disPresupuesto', () => {
    const disPresupuesto = ref([]);

    const obtenerInfoDisPresupues = async () => {
        try {
            let responseDisPresupues = await axios.get('disPresupues/ver');
            disPresupuesto.value = responseDisPresupues.data.disPresupuesto; 
        } catch (error) {
            throw error
        }
    };

    const postDisPresupuesto = async (data) =>{
        try {
            let res = await axios.post("disPresupues/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putDisPresupuesto = async (id, data) => {
        try {
            let res = await axios.put(`disPresupues/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let res = await axios.put(`disPresupues/inactivar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de presupuesto");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let res = await axios.put(`disPresupues/activar/${id}`)
            return res
        } catch (error) {
            console.log(error, "Error al cambiar el estado de la distribucion de presupuesto");
        }
    }

    return {
        disPresupuesto,
        obtenerInfoDisPresupues, postDisPresupuesto, putDisPresupuesto, putInactivar, putActivar
    };
}); */