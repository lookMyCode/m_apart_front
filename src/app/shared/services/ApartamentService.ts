import { HttpService } from "./HttpService";


interface CreateApartamentInputData {
  street: string,
  houseNumber: string,
  apartamentNumber?: string,
  postcode?: string,
  city: string,
  worker: string,
}

interface UpdateApartamentInputData extends CreateApartamentInputData {
  _id: string,
}


export class ApartamentService {

  static async getApartaments(hint = '') {
    const resp = await HttpService.get(`/apartaments?hint=${hint || ''}`);
    return resp.data;
  }

  static async getApartament(id: string) {
    const resp = await HttpService.get(`/apartaments/${id}`);
    return resp.data;
  }

  static async createApartament(model: CreateApartamentInputData) {
    const resp = await HttpService.post('/apartaments', model);
    return resp.data;
  }

  static async updateApartament(data: UpdateApartamentInputData) {
    const resp = await HttpService.put(`/apartaments/${data._id}`, data);
    return resp.data;
  }

  static async deleteApartament(id: string) {
    const resp = await HttpService.delete(`/apartaments/${id}`, {});
    return resp.data;
  }

  static async uploadFile(id: string, fd: FormData) {
    await HttpService.post(`/apartaments/${id}/file`, fd);
    return true;
  }
}