import { Paging } from "@/types/pagination";
import { List } from "@/types/list";

export declare interface RegencyView {
  id: string;
  provinceId: string;
  regencyName: string;
  provinceName: string;
}

export declare interface PageRegency extends Paging {
  regencyName: string;
  provinceId: string;
}

export declare interface ListRegency extends List {
  regencyName: string;
  provinceId: string;
}