import { Paging } from "@/types/pagination";
import { List } from "@/types/list";

export declare interface VillageView {
  id: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageName: string;
  districtName: string;
  regencyName: string;
  provinceName: string;
}

export declare interface PageVillage extends Paging {
  villageName: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
}

export declare interface ListVillage extends List {
  villageName: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
}