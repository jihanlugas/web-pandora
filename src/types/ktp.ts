import { Paging } from "@/types/pagination";

export declare interface KtpView {
  id: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  alamat: string;
  rtrw: string;
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
  provinceName: string;
  regencyName: string;
  districtName: string;
  villageName: string;
}


export declare interface CreateKtp {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  alamat: string;
  rtrw: string;
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
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  alamat: string;
  rtrw: string;
  pekerjaan: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  berlakuHingga?: string;
}

export declare interface PageKtp extends Paging {
  nik: string;
  nama: string;
  jenisKelamin: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  alamat: string;
  rtrw: string;
  pekerjaan: string;
  statusPerkawinan: string;
  kewarganegaraan: string;
  createBy: string;
}