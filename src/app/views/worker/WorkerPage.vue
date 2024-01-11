<template>
  <v-container>
    <v-card class="pa-4 mb-8">
      <v-form fast-fail @submit.prevent="submit">
        <v-row>
          <v-col>
            <h2>Дані користувача</h2>
          </v-col>
        </v-row>

        <v-row>

          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field 
              label="Ім'я"
              v-model="model.name"
              :rules="form.nameRules"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field 
              label="Призвіще"
              v-model="model.surname"
              :rules="form.surnameRules"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field 
              label="Номер телефону"
              type="tel"
              v-model="model.tel"
              :rules="form.telRules"
            ></v-text-field>
          </v-col>

        </v-row>

        <v-row>
          <v-col>
            <v-btn 
              color="primary" 
              block 
              class="my-2"
              type="submit" 
            >Записати</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>


<script lang="ts">
import { Validators } from '@/app/shared/services/Validators';
import { WorkerService } from '@/app/shared/services/WorkerService';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';


export default defineComponent({

data () {
  return {
    id: undefined as string | undefined,

    model: {
      name: '',
      surname: '',
      tel: '',
    },

    form: {
      nameRules: [Validators.stringIsRequired],
      surnameRules: [Validators.stringIsRequired],
      telRules: [
        (value: string) => {
          const v = (value || '').trim();
          const notEmpty = Validators.stringIsRequired(v);
          if (notEmpty !== true) return notEmpty;

          const regExp = /^(?:\+48)?\d{9}$/;
          if (!regExp.test(v)) return 'Номер телефону повинен бути в форматі +48XXXXXXXXX чи XXXXXXXXX';
          return true;
        },
      ],
    },
  }
},

mounted() {
  this.parseParams();
},

methods: {
  parseParams() {
    const id = this.$route.params.id;
    if (id === 'new') return;

    this.id = id as string;
    this.getWorker();
  },

  async getWorker() {
    const model = await WorkerService.getWorker(this.id as string);
    this.model = model;
  },

  async submit(event: any) {
    const results = await event;
    if (!results.valid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Дані не валідні",
      });
      
      return;
    }
    
    try {
      const ok = !this.id 
        ? await WorkerService.createWorker(this.model)
        : await WorkerService.updateWorker(this.model as any);
        
      if (!ok) throw new Error();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Записано",
        showConfirmButton: false,
        timer: 1500
      });

      this.$router.push('/workers');
    } catch (err) {
      console.error(err);
    }
  },
},

})
</script>
