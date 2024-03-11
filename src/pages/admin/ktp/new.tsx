import MainAdmin from '@/components/layout/main-admin';
import { Api } from '@/lib/api';
import { CreateKtp } from '@/types/ktp';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikValues } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import * as Yup from 'yup';
import notif from '@/utils/notif';
import TextField from '@/components/formik/text-field';
import TextAreaField from '@/components/formik/text-area-field';
import ButtonSubmit from '@/components/formik/button-submit';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import DateField from '@/components/formik/date-field';
import DropdownField from '@/components/formik/dropdown-field';
import { GENDER, STATUS_PERKAWINAN } from '@/utils/constant';
import { useEffect, useState } from 'react';
import { ListProvince, ProvinceView } from '@/types/province';
import { ListRegency, RegencyView } from '@/types/regency';
import { ListVillage, VillageView } from '@/types/village';
import { DistrictView, ListDistrict } from '@/types/district';


type Props = {
}

const schema = Yup.object().shape({
  nik: Yup.string().required("Required field"),
  nama: Yup.string().required("Required field"),
  tempatLahir: Yup.string().required("Required field"),
  tanggalLahir: Yup.date().required("Required field"),
  jenisKelamin: Yup.string().required("Required field"),
  provinceId: Yup.string().required("Required field"),
  regencyId: Yup.string().required("Required field"),
  districtId: Yup.string().required("Required field"),
  villageId: Yup.string().required("Required field"),
  alamat: Yup.string().required("Required field"),
  rtrw: Yup.string().required("Required field"),
  pekerjaan: Yup.string().required("Required field"),
  statusPerkawinan: Yup.string().required("Required field"),
  kewarganegaraan: Yup.string().required("Required field"),
});

const New: NextPage<Props> = () => {
  const router = useRouter();

  const [listProvince, setListProvince] = useState<ProvinceView[]>([]);
  const [listRegency, setListRegency] = useState<RegencyView[]>([]);
  const [listDistrict, setListDistrict] = useState<DistrictView[]>([]);
  const [listVillage, setListVillage] = useState<VillageView[]>([]);

  const initFormikValue: CreateKtp = {
    nik: "",
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    provinceId: "",
    regencyId: "",
    districtId: "",
    villageId: "",
    alamat: "",
    rtrw: "",
    pekerjaan: "",
    statusPerkawinan: "",
    kewarganegaraan: "",
    berlakuHingga: null,
  };

  const [listRequestProvince, setListRequestProvince] = useState<ListProvince>({
    limit: 100,
    provinceName: '',
  });

  const [listRequestRegency, setListRequestRegency] = useState<ListRegency>({
    limit: 100,
    regencyName: '',
    provinceId: '--',
  });

  const [listRequestDistrict, setListRequestDistrict] = useState<ListDistrict>({
    limit: 100,
    districtName: '',
    provinceId: '--',
    regencyId: '--',
  });

  const [listRequestVillage, setListRequestVillage] = useState<ListVillage>({
    limit: 100,
    villageName: '',
    provinceId: '--',
    regencyId: '--',
    districtId: '--',
  });

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['create-ktp'],
    mutationFn: (val: FormikValues) => Api.post('/ktp', val),
  });

  const { isLoading: isLoadingListProvince, data: dataListProvince, refetch: refetchListProvince } = useQuery({
    queryKey: ['list-province', listRequestProvince],
    queryFn: ({ queryKey }) => Api.get('/province/list', queryKey[1]),
  });

  const { isLoading: isLoadingListRegency, data: dataListRegency, refetch: refetchListRegency } = useQuery({
    queryKey: ['list-regency', listRequestRegency],
    queryFn: ({ queryKey }) => Api.get('/regency/list', queryKey[1]),
  });

  const { isLoading: isLoadingListDistrict, data: dataListDistrict, refetch: refetchListDistrict } = useQuery({
    queryKey: ['list-district', listRequestDistrict],
    queryFn: ({ queryKey }) => Api.get('/district/list', queryKey[1]),
  });

  const { isLoading: isLoadingListVillage, data: dataListVillage, refetch: refetchListVillage } = useQuery({
    queryKey: ['list-village', listRequestVillage],
    queryFn: ({ queryKey }) => Api.get('/village/list', queryKey[1]),
  });

  // console.log('listProvince ', listProvince.length, listProvince)
  // console.log('listRegency ', listRegency.length, listRegency)
  // console.log('listDistrict ', listDistrict.length, listDistrict)
  // console.log('listVillage ', listVillage.length, listVillage)

  const handleSubmit = (values: FormikValues, setErrors) => {
    values.tanggalLahir = new Date(values.tanggalLahir);
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push('/admin/ktp');
          } else if (!res.success) {
            if (res.payload && res.payload.listError) {
              setErrors(res.payload.listError);
            } else {
              notif.error(res.message);
            }
          }
        }
      },
      onError: (res) => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleChangeProvince = (e, setFieldValue) => {
    setListRequestRegency({
      ...listRequestRegency,
      provinceId: e.target.value,
    });
    setListRequestDistrict({
      ...listRequestDistrict,
      provinceId: e.target.value,
      regencyId: '--',
    });
    setListRequestVillage({
      ...listRequestVillage,
      provinceId: e.target.value,
      regencyId: '--',
      districtId: '--',
    });

    setFieldValue('provinceId', e.target.value);
    setFieldValue('regencyId', '');
    setFieldValue('districtId', '');
    setFieldValue('villageId', '');

    refetchListRegency();
    refetchListDistrict();
    refetchListVillage();
  }

  const handleChangeRegency = (e, setFieldValue) => {
    setListRequestDistrict({
      ...listRequestDistrict,
      regencyId: e.target.value,
    });
    setListRequestVillage({
      ...listRequestVillage,
      regencyId: e.target.value,
      districtId: '--',
    });

    setFieldValue('regencyId', e.target.value);
    setFieldValue('districtId', '');
    setFieldValue('villageId', '');

    refetchListDistrict();
    refetchListVillage();
  }

  const handleChangeDistrict = (e, setFieldValue) => {
    setListRequestVillage({
      ...listRequestVillage,
      districtId: e.target.value,
    });

    setFieldValue('districtId', e.target.value);
    setFieldValue('villageId', '');

    refetchListVillage();
  }


  useEffect(() => {
    if (dataListProvince && dataListProvince.status) {
      setListProvince(dataListProvince.payload);
    }
  }, [dataListProvince]);

  useEffect(() => {
    if (dataListRegency && dataListRegency.status) {
      setListRegency(dataListRegency.payload);
    }
  }, [dataListRegency]);

  useEffect(() => {
    if (dataListDistrict && dataListDistrict.status) {
      setListDistrict(dataListDistrict.payload);
    }
  }, [dataListDistrict]);

  useEffect(() => {
    if (dataListVillage && dataListVillage.status) {
      setListVillage(dataListVillage.payload);
    }
  }, [dataListVillage]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Ktp New'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/admin/ktp'}>
                <div className='mr-4 hover:text-primary-500'>{'Ktp'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/admin/ktp'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{'New'}</div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Create Ktp</div>
          </div>
          <div className='mb-4'>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className={'w-full max-w-xl'}>
                      <div className="mb-4">
                        <TextField
                          label={'NIK'}
                          name={'nik'}
                          type={'text'}
                          placeholder={'NIK'}
                          inputMode={'numeric'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Nama'}
                          name={'nama'}
                          type={'text'}
                          placeholder={'Nama'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Tempat Lahir'}
                          name={'tempatLahir'}
                          type={'text'}
                          placeholder={'Tempat Lahir'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <DateField
                          label={'Tanggal Lahir'}
                          name={'tanggalLahir'}
                          placeholder={'Tanggal Lahir'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Jenis Kelamin'}
                          name={'jenisKelamin'}
                          placeholder={'Pilih jenis kelamin'}
                          items={Object.values(GENDER)}
                          required={true}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Provinsi'}
                          name={'provinceId'}
                          placeholder={'Pilih Provinsi'}
                          items={listProvince}
                          required={true}
                          keyLabel={'provinceName'}
                          keyValue={'id'}
                          onChange={e => handleChangeProvince(e, setFieldValue)}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Kabupaten/Kota'}
                          name={'regencyId'}
                          placeholder={'Pilih Kabupaten/Kota'}
                          items={listRegency}
                          required={true}
                          keyLabel={'regencyName'}
                          keyValue={'id'}
                          onChange={e => handleChangeRegency(e, setFieldValue)}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Kecamatan'}
                          name={'districtId'}
                          placeholder={'Pilih Kecamatan'}
                          items={listDistrict}
                          required={true}
                          keyLabel={'districtName'}
                          keyValue={'id'}
                          onChange={e => handleChangeDistrict(e, setFieldValue)}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Kelurahan/Desa'}
                          name={'villageId'}
                          placeholder={'Pilih Kelurahan/Desa'}
                          items={listVillage}
                          required={true}
                          keyLabel={'villageName'}
                          keyValue={'id'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Alamat'}
                          name={'alamat'}
                          type={'text'}
                          placeholder={'Alamat'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'RT/RW'}
                          name={'rtrw'}
                          type={'text'}
                          placeholder={'RT/RW'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Pekerjaan'}
                          name={'pekerjaan'}
                          type={'text'}
                          placeholder={'Pekerjaan'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Status Perkawinan'}
                          name={'statusPerkawinan'}
                          placeholder={'Pilih status perkawinan'}
                          items={Object.values(STATUS_PERKAWINAN)}
                          keyValue={'value'}
                          keyLabel={'label'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Kewarganegaraan'}
                          name={'kewarganegaraan'}
                          type={'text'}
                          placeholder={'Kewarganegaraan'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Create'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>

    </>
  )
}



(New as PageWithLayoutType).layout = MainAdmin;

export default New;