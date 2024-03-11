import { Paging } from "@/types/pagination";
import { List } from "@/types/list";

export declare interface ProvinceView {
  id: string;
  provinceName: string;
}

export declare interface PageProvince extends Paging {
  provinceName: string;
}

export declare interface ListProvince extends List {
  provinceName: string;
}