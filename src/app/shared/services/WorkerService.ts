import { HttpService } from "./HttpService";


interface CreateWorkerInputData {
  name: string,
  surname: string,
  tel: string,
}

interface UpdateWorkerInputData extends CreateWorkerInputData {
  _id: string,
}


export class WorkerService {
  
  static async getWorkers(hint = '') {
    const resp = await HttpService.get(`/workers?hint=${hint || ''}`);
    return resp.data;
  }

  static async getWorker(id: string) {
    const resp = await HttpService.get(`/workers/${id}`);
    return resp.data;
  }

  static async createWorker(data: CreateWorkerInputData) {
    const x = {
      ...data,
      login: Date.now().toString(),
      password: Date.now().toString(),
    }

    const resp = await HttpService.post('/workers', x);
    return resp.data;
  }

  static async updateWorker(data: UpdateWorkerInputData) {
    const resp = await HttpService.put(`/workers/${data._id}`, data);
    return resp.data;
  }

  static async deleteWorker(id: string) {
    const resp = await HttpService.delete(`/workers/${id}`, {});
    return resp.data;
  }
}