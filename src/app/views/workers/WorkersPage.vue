<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-text-field 
            label="Фрагмет імені чи призвіща для пошуку" 
            v-model="hint"
            @input="filterWorkers"
          ></v-text-field>
          <v-btn 
            color="success mr-3"
            href="/workers/new"
          >
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row 
      v-for="worker in filteredWorkers"
      v-bind:key="worker._id"
    >
      <v-col>
        <worker-card
          :name="worker.name"
          :surname="worker.surname"
          :id="worker._id"
          @remove="deleteWorker($event)"
        ></worker-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { WorkerService } from '@/app/shared/services/WorkerService';
import Swal from 'sweetalert2';

export default {

  data() {
    return {
      hint: '',
      workers: [],
      filteredWorkers: [],
    }
  },

  mounted() {
    this.getWorkers();
  },

  methods: {
    async getWorkers() {
      const workers = await WorkerService.getWorkers();
      this.workers = workers;
      this.filterWorkers();
    },

    async deleteWorker(id) {
      Swal.fire({
        title: "Чи напевно хочеш усунути працівника?",
        showCancelButton: true,
        confirmButtonText: "Так",
        cancelButtonText: `Ні`
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        await WorkerService.deleteWorker(id);
        this.getWorkers();
      });
    },

    filterWorkers() {
      const hint = this.hint.trim();
      const hintParts = hint
        .split(' ')
        .map(x => x.trim().toLowerCase())
        .filter(x => !!x);

      this.filteredWorkers = this.workers.filter(worker => {
        if (!hintParts.length) return true;

        return hintParts.some(part => {
          return worker.name.toLowerCase().includes(part) || worker.surname.toLowerCase().includes(part);
        });
      });
    },
  },

}
</script>
