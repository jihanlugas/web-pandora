import { Paging } from "@/types/pagination";
import { List } from "@/types/list";

export declare interface DistrictView {
  id: string;
  provinceId: string;
  regencyId: string;
  districtName: string;
  regencyName: string;
  provinceName: string;
}

export declare interface PageDistrict extends Paging {
  districtName: string;
  provinceId: string;
  regencyId: string;
}

export declare interface ListDistrict extends List {
  districtName: string;
  provinceId: string;
  regencyId: string;
}