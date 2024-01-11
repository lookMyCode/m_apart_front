<template>
  <v-container fluid class="d-flex justify-center align-center h-100">
    <v-card class="w-50 pa-5">
      <v-card-title class="text-center mb-3">Логування</v-card-title>
      <v-form fast-fail @submit.prevent="submit">
        <v-text-field
          v-model="model.login"
          label="Login"
          :rules="form.loginRules"
        ></v-text-field>

        <v-text-field
          v-model="model.password"
          label="Пароль"
          :rules="form.passwordRules"
        ></v-text-field>

        <v-btn type="submit" color="primary" block class="mt-2">Вхід</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import Swal from 'sweetalert2';
import { AuthService } from '@/app/shared/services/AuthService';


export default {
  data: () => ({
    model: {
      login: '',
      password: '',
    },
    form: {
      loginRules: [
      value => {
          if (!(value || '').trim()) return 'Логін є вимаганий';
          return true;
        },
      ],
      passwordRules: [
      value => {
          if (!(value || '').trim()) return 'Пароль є вимаганий';
          return true;
        },
      ],
    },
  }),

  methods: {

    async submit(event) {
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
        const ok = await AuthService.login(this.model);
        if (!ok) throw new Error();

        this.$router.push('/apartaments');
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Не правильний логін або пароль",
        });
      }
    },

  },
}
</script>

<style>
  
</style>