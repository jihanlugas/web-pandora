import { Paging } from "@/types/pagination";

export declare interface UserView {
  id: string;
  role: string;
  email: string;
  username: string;
  noHp: string;
  fullname: string;
  passVersion: number;
  isActive: boolean;
  lastLoginDt?: string;
  photoId: string;
  photoUrl: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  deleteName: string;
}


export declare interface CreateUser {
  fullname: string;
  email: string;
  noHp: string;
  username: string;
  passwd: string;
  name: string;
  description: string;
  balance: number;
}

export declare interface UpdateUser {
  fullname: string;
  email: string;
  noHp: string;
  username: string;
}

export declare interface PageUser extends Paging{
  fullname: string;
  email: string;
  noHp: string;
  username: string;
  createBy: string;
}