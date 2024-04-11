import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useProveedorStore = defineStore('provedor', () => {
    const proveedores = ref([]);

    const obtenerInfoProveedor = async () => {
        try {
            let responseProveedor = await axios.get('provedor/ver');
            console.log (responseProveedor);
            // lotes.value = responseLotes.data; 
            return responseProveedor.data
            console.log(proveedores)
        } catch (error) {
            throw error
        }
    };

    const postProveedor = async (data) =>{
        try {
            console.log('a');
            let res = await axios.post("provedor/agregar", data);
            console.log('a', res);
            return res.data.provedores
        } catch (error) {
            return error.response.data;
        }
    }

    const putProveedor = async (id, data) => {
        try {
            let res = await axios.put(`provedor/modificar/${id}`, data);
            return res
        } catch (error) {
            return error.response.data;
        }
    };

    const putInactivar = async (id)=>{
        try {
            let r = await axios.put(`provedor/inactivar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del proveedor");
        }
    }
    const  putActivar = async (id)=>{
        try {
            let r = await axios.put(`provedor/activar/${id}`)
            return r
        } catch (error) {
            console.log(error, "Error al cambiar el estado del proveedor");
        }
    } 

    return {
        proveedores,
        obtenerInfoProveedor, postProveedor, putProveedor, putInactivar, putActivar
    };
});