/*  import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProductoStore = defineStore('producto', () => {
    const productos = ref([]);

    const obtenerInfoProductos = async () => {
        try {
            let responseBuses = await axios.get('producto/ver');
            buses.value = responseBuses.data.buses; 
        } catch (error) {
            throw error
        }
    };

    const postProducto = async (data) =>{
        try {
            let res = await axios.post("producto/agregar", data);
            return res
        } catch (error) {
            throw error
        }
    }

    const putProducto = async (id, data) => {
        try {
            let res = await axios.put(`producto/modificar/${id}`, data);
            return res
        } catch (error) {
            throw error;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`producto/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del producto");
        }
    }
    const putActivar = async (id)=>{
        try {
            let r = await axios.put(`bus/activarBus/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del producto");
        }
    }

    return {
        productos,
        obtenerInfoProductos, postProducto, putProducto, putInactivar,putActivar 
    };
});  */