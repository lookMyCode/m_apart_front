<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-text-field 
            label="Фрагмет назви для пошуку"
            v-model="hint"
            @input="filterApartaments"
          ></v-text-field>
          <v-btn 
            color="success mr-3"
            href="/apartaments/new"
          >
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row 
      v-for="apartament in filteredApartaments" 
      v-bind:key="apartament._id"
    >
      <v-col>
        <apartament-card
          :title="apartament.name"
          :id="apartament._id"
          @remove="deleteApartament($event)"
        ></apartament-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { ApartamentService } from '@/app/shared/services/ApartamentService';
import Swal from 'sweetalert2';

export default {

  data() {
    return {
      hint: '',
      apartaments: [],
      filteredApartaments: [],
    }
  },

  mounted() {
    this.getApartaments();
  },

  methods: {
    async getApartaments() {
      const apartaments = await ApartamentService.getApartaments();
      this.apartaments = apartaments.map(apartament => {
        let name = `${apartament.street} ${apartament.houseNumber}`;
        if (apartament.apartamentNumber) name = `${name} / ${apartament.apartamentNumber}`;

        return {
          ...apartament,
          name,
        }
      });

      this.filterApartaments();
    },

    async deleteApartament(id) {
      Swal.fire({
        title: "Чи напевно хочеш усунути об'єкт?",
        showCancelButton: true,
        confirmButtonText: "Так",
        cancelButtonText: `Ні`
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        await ApartamentService.deleteApartament(id);
        this.getApartaments();
      });
    },

    filterApartaments() {
      const hint = this.hint.trim();
      const hintParts = hint
        .split(' ')
        .map(x => x.trim().toLowerCase())
        .filter(x => !!x);

      this.filteredApartaments = this.apartaments.filter(apartament => {
        if (!hintParts.length) return true;

        return hintParts.some(part => {
          return apartament.street.toLowerCase().includes(part) || apartament.name.toLowerCase().includes(part);
        });
      });
    },
  },

}
</script>
