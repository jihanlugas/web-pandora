export const USER_ROLE_ADMIN = 'ADMIN'
export const USER_ROLE_USER = 'USER'

export const GENDER = {
  'MALE': {
    value: 'MALE',
    label: 'Male',
  },
  'FEMALE': {
    value: 'FEMALE',
    label: 'Female',
  },
};

export const STATUS_PERKAWINAN = {
  'BELUM KAWIN': {
    value: 'BELUM KAWIN',
    label: 'Belum Kawin',
  },
  'KAWIN': {
    value: 'KAWIN',
    label: 'Kawin',
  },
  'CERAI HIDUP': {
    value: 'CERAI HIDUP',
    label: 'Cerai Hidup',
  },
  'CERAI MATI': {
    value: 'CERAI MATI',
    label: 'Cerai Mati',
  },
};

export const MENU_ADMIN = [
  {
    name: 'Overview',
    icon: 'BiAbacus',
    path: '/overview',
  },
  {
    name: 'User',
    icon: 'BiAbacus',
    path: '/admin/user',
  },
  {
    name: 'Ktp',
    icon: 'BiAbacus',
    path: '/ktp',
  },
];

export const MENU_USER = [
  {
    name: 'Overview',
    icon: 'BiAbacus',
    path: '/overview',
  },
  {
    name: 'Ktp',
    icon: 'BiAbacus',
    path: '/ktp',
  },
];