
<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit v-model="props.row.calories" title="Update calories" buttons v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model="props.row.fat" v-slot="scope">
              <q-input type="textarea" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit v-model="props.row.carbs" title="Update carbs" buttons persistent v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close" />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const columns = [
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true, style: 'width: 10px' },
  { name: 'cedula', align: 'center', label: 'Cedula', field: 'cedula', sortable: true, style: 'width: 10px' },
  { name: 'correo',align: 'center',  label: 'Correo', field: 'correo', sortable: true, style: 'width: 10px' },
  { name: 'telefono',align: 'center',  label: 'Telefono', field: 'telefono', sortable: true, style: 'width: 10px' },
  { name: 'contrasena',align: 'center',  label: 'Contraseña', field: 'contrasena', sortable: true, style: 'width: 10px' },
  { name: 'rol',align: 'center',  label: 'Rol', field: 'rol', sortable: true, style: 'width: 10px' },
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false,},

]

const rows = []
</script>

<style scoped>
</style>