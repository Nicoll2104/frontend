<!-- <template>
<div class="cont">====================tabla Pedidos=====================</div>
</template>


<style scoped>
.cont {
  color: rgb(51, 190, 93);
}
</style> -->
<template>
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Pedidos"
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
  { name: 'Fecha_creacion', align: 'center', label: 'Fecha_creacion', field: 'fecha_creacion'},
  { name: 'Fecha_entrega', align: 'center', label: 'Fecha_entrega', field: 'fecha_entrega'},
  { name: 'Distribucion_ficha',align: 'center',  label: 'Distribucion_ficha', field: 'distribucion_ficha' },
  { name: 'Instructor_encargado',align: 'center',  label: 'Instructor_encargado', field: 'instructor_encargado' },
  { name: 'Subtotal',align: 'center',  label: 'Subtotal', field: 'subtotal' },
  { name: 'Total',align: 'center',  label: 'Total', field: 'total' },
  { name: 'Items',align: 'center',  label: 'Items', field: 'items' },
  { name: 'Estado',align: 'center',  label: 'Estado', field: 'status' },
]

const rows = []
</script>

<style scoped>
</style>