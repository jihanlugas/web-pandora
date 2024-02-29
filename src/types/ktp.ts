import { Paging } from "@/types/pagination";

export declare interface KtpView {
  id: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  rtrw: string;
  kelurahanDesa: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  pekerjaan: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  berlakuHingga?: string;
  photoId: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
}


export declare interface CreateKtp {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  rtrw: string;
  kelurahanDesa: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  pekerjaan: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  berlakuHingga?: string;
}

export declare interface UpdateKtp {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  rtrw: string;
  kelurahanDesa: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  pekerjaan: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  berlakuHingga?: string;
}

export declare interface PageKtp extends Paging {
  nik: string;
  nama: string;
  jenisKelamin: string;
  alamat: string;
  kelurahanDesa: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  createBy: string;
}