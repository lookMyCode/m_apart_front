<template lang="">
  <v-container>
    <v-card class="pa-4 mb-8">
      <v-form fast-fail @submit.prevent="submit">
        <v-row>
          <v-col>
            <h2>Дані об'єкту</h2>
          </v-col>
        </v-row>

        <v-row>

          <v-col 
            cols="12"
            md="6"
          >
            <v-text-field 
              label="Вулиця"
              v-model="model.street"
              :rules="form.streetRules"
            ></v-text-field>
          </v-col>

          <v-col 
            cols="12"
            sm="6"
            md="3"
          >
            <v-text-field 
              label="Номер будинку"
              v-model="model.houseNumber"
              :rules="form.houseNumberRules"
            ></v-text-field>
          </v-col>

          <v-col 
            cols="12"
            sm="6"
            md="3"
          >
            <v-text-field 
              label="Номер квартири"
              v-model="model.apartamentNumber"
            ></v-text-field>
          </v-col>

        </v-row>

        <v-row>

          <v-col 
            cols="12"
            sm="4"
          >
            <v-text-field 
              label="Індекс"
              v-model="model.postcode"
              :rules="form.postcodeRules"
            ></v-text-field>
          </v-col>

          <v-col 
            cols="12"
            sm="8"
          >
            <v-text-field 
              label="Місто"
              v-model="model.city"
              :rules="form.cityRules"
            ></v-text-field>
          </v-col>

        </v-row>

        <v-row>
          <v-col>
            <v-select 
              label="Прибиральник по замовчуванню"
              :items="workers"
              item-title="fullname"
              item-value="_id"
              v-model="model.worker"
              :rules="form.workerRules"
            ></v-select>
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

    <v-card 
      v-if="id"
      class="pa-4"
    >
      <v-row>
        <v-col>
          <h2>Файли</h2>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn 
            color="success"
            @click="openUploader"
          >
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </v-col>
        <input 
          type="file" 
          class="d-none" 
          ref="uploader"
          @change="uploadFile"
        >
      </v-row>

      <v-row v-if="getFilesGroupedByType.images.length">
        <v-col>
          <h2>Фото</h2>
        </v-col>
      </v-row>

      <v-row v-if="getFilesGroupedByType.images.length">
        <v-col 
          class="v-col-12 v-col-sm-6 v-col-md-4 v-col-lg-3"
          v-for="file in getFilesGroupedByType.images"
          v-bind:key="file.fileName"
        >
          <a 
            :href="file.path" 
            target="_blank"
            width="100%"
          >
            <v-img
              width="100%"
              :src="file.path"
            ></v-img>
            <span>{{ file.created }}</span>
          </a>
          
        </v-col>
      </v-row>

      <v-row v-if="getFilesGroupedByType.videos.length">
        <v-col>
          <h2>Відео</h2>
        </v-col>
      </v-row>

      <v-row v-if="getFilesGroupedByType.videos.length">
        <v-col>
          <ul>
            <li 
              v-for="file in getFilesGroupedByType.videos"
              v-bind:key="file.fileName"
            >
              <a :href="file.path" target="_blank">{{ file.fileName }}({{ file.created }})</a>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-row v-if="getFilesGroupedByType.others.length">
        <v-col>
          <h2>Інші</h2>
        </v-col>
      </v-row>

      <v-row v-if="getFilesGroupedByType.others.length">
        <v-col>
          <ul>
            <li 
              v-for="file in getFilesGroupedByType.others"
              v-bind:key="file.fileName"
            >
              <a :href="file.path" target="_blank">{{ file.fileName }} ({{ file.created }})</a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>


<script lang="ts">
import Swal from 'sweetalert2';
import { Validators } from '@/app/shared/services/Validators';
import { ApartamentService } from '@/app/shared/services/ApartamentService'
import { WorkerService } from '@/app/shared/services/WorkerService';
import { defineComponent } from 'vue';
import { ApartamentFile } from '@/app/shared/models/interfaces/ApartamentFile';
import { BASE_URL } from '@/app/shared/models/constants/BASE_URL';


export default defineComponent({

data () {
  return {
    id: undefined as string | undefined,

    model: {
      street: '',
      houseNumber: '',
      apartamentNumber: '',
      postcode: '',
      city: '',
      worker: '',
      files: [] as ApartamentFile[],
    },

    form: {
      streetRules: [Validators.stringIsRequired],
      houseNumberRules: [Validators.stringIsRequired],
      postcodeRules: [
        (value: string) => {
          const v = (value || '').trim();
          if (!v) return true;
          
          const regExp = /^\d{2}-\d{3}$/;
          if (!regExp.test(v)) return 'Індекс повинен бути в форматі 00-000';
        },
      ],
      cityRules: [Validators.stringIsRequired],
      workerRules: [Validators.stringIsRequired],
    },

    workers: [],

    items: [
      {
        title: 'Item #1', value: 1,
      },
      {
        title: 'Item #2', value: 2,
      },
      {
        title: 'Item #3', value: 3,
      },
    ],
  }
},

mounted() {
  this.getWorkers();
  this.parseParams();
},

methods: {
  async getWorkers() {
    const workers = await WorkerService.getWorkers();
    this.workers = workers.map((worker: any) => {
      return {
        ...worker,
        fullname: `${worker.name} ${worker.surname}`,
      }
    });
  },

  parseParams() {
    const id = this.$route.params.id;
    if (id === 'new') return;

    this.id = id as string;
    this.getApartament();
  },

  async getApartament() {
    const model = await ApartamentService.getApartament(this.id as string);
    (model.files as ApartamentFile[]).forEach(file => {
      file.createdDate = new Date(file.createdAt);
    });

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
        ? await ApartamentService.createApartament(this.model)
        : await ApartamentService.updateApartament(this.model as any);
        
      if (!ok) throw new Error();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Записано",
        showConfirmButton: false,
        timer: 1500
      });

      this.$router.push('/apartaments');
    } catch (err) {
      console.error(err);
    }
  },

  openUploader() {
    const uploader = this.$refs.uploader as HTMLInputElement;
    uploader.files = null;
    uploader.value = null as unknown as string;
    uploader.click();
  },

  async uploadFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const file = files.item(0);
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);
    
    await ApartamentService.uploadFile(this.id as string, fd);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Записано",
      showConfirmButton: false,
      timer: 1500
    });

    this.getApartament();
  }
},

computed: {
  getFilesGroupedByType() {
    const files: ApartamentFile[] = JSON.parse(JSON.stringify(this.model.files));
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExts = ['mp4', 'mov', 'avi', 'wmv', 'avchd', 'webm', 'flv', 'mkv'];

    const sortFunc = (a: ApartamentFile, b: ApartamentFile) => {
      const at = a.createdDate.getTime();
      const bt = b.createdDate.getTime();

      if (at > bt) return -1;
      if (at < bt) return 1;
      return 0;
    }

    const processFile = (file: ApartamentFile) => {
      const path = `${BASE_URL}/apartaments/file/${file.fileName}`;
      const createdDate = new Date(file.createdDate);

      const d = createdDate.getDate();
      const M = createdDate.getMonth() + 1;
      const y = createdDate.getFullYear();
      const h = createdDate.getHours();
      const m = createdDate.getMinutes();

      const MM = M > 9 ? M : '0' + M;
      const hh = h > 9 ? h : '0' + h;
      const mm = m > 9 ? m : '0' + m;

      const created = `${d}.${MM}.${y} ${hh}:${mm}`;

      return {
        ...file,
        createdDate,
        created,
        path,
      }
    }

    const images: ApartamentFile[] = files
      .map(processFile)
      .filter(file => {
        const { fileName } = file;
        const [ _, ext ] = fileName.split('.');
        return imageExts.includes(ext.toLowerCase());
      })
      .sort(sortFunc);

    const videos: ApartamentFile[] = files
      .map(processFile)
      .filter(file => {
        const { fileName } = file;
        const [ _, ext ] = fileName.split('.');
        return videoExts.includes(ext.toLowerCase());
      })
      .sort(sortFunc);

    const others: ApartamentFile[] = files
      .map(processFile)
      .filter(file => {
        const { fileName } = file;
        const [ _, ext ] = fileName.split('.');
        return !imageExts.includes(ext.toLowerCase()) && !videoExts.includes(ext.toLowerCase());
      })
      .sort(sortFunc);
      
    return {
      images,
      videos,
      others,
    }
  },
},

})
</script>
