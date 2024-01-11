<template>
  <v-layout>
    <v-app-bar app scroll-behavior="hide" scroll-threshold="500" color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      
      <template v-slot:append>
        <v-btn @click="logout">
          <v-icon icon="mdi-logout"></v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      color="primary"
    >
    <v-list-item 
      v-for="item in navItems" :key="item.path"
      link 
      :title="item.title" 
      :href="item.path"
    > </v-list-item>
    <!-- <v-list-item-group>
        
        <v-list-item v-for="item in navItems" :key="item.path">
          <v-list-item-title>
            <router-link :to="item.path">{{ item.name }}</router-link>
          </v-list-item-title>
        </v-list-item>
        
      </v-list-item-group> -->

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">
            Вилогуватися
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import { AuthService } from '../services/AuthService';


export default defineComponent({

  name: 'App',

  data () {
    return {
      drawer: false,
      navItems: [
        {
          title: 'Об\'єкти',
          path: '/apartaments',
        },
        {
          title: 'Працівники',
          path: '/workers',
        },
      ],
    }
  },

  methods: {
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    },
  },

})
</script>
