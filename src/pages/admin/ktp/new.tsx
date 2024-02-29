import MainAdmin from '@/components/layout/main-admin';
import { Api } from '@/lib/api';
import { CreateKtp } from '@/types/ktp';
import PageWithLayoutType from '@/types/layout';
import { useMutation } from '@tanstack/react-query';
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


type Props = {
}

const schema = Yup.object().shape({
  nik: Yup.string().required("Required field"),
  nama: Yup.string().required("Required field"),
  tempatLahir: Yup.string().required("Required field"),
  tanggalLahir: Yup.date().required("Required field"),
  jenisKelamin: Yup.string().required("Required field"),
  alamat: Yup.string().required("Required field"),
  rtrw: Yup.string().required("Required field"),
  kelurahanDesa: Yup.string().required("Required field"),
  kecamatan: Yup.string().required("Required field"),
  kabupatenKota: Yup.string().required("Required field"),
  provinsi: Yup.string().required("Required field"),
  pekerjaan: Yup.string().required("Required field"),
  statusPerkawinan: Yup.string().required("Required field"),
  kewarganegaraan: Yup.string().required("Required field"),
});

const New: NextPage<Props> = () => {
  const router = useRouter();

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['create-ktp'],
    mutationFn: (val: FormikValues) => Api.post('/ktp', val),
  });

  const initFormikValue: CreateKtp = {
    nik: "",
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    rtrw: "",
    kelurahanDesa: "",
    kecamatan: "",
    kabupatenKota: "",
    provinsi: "",
    pekerjaan: "",
    statusPerkawinan: "",
    kewarganegaraan: "",
    berlakuHingga: null,
  };

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
                  <Form>
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
                          label={'Provinsi'}
                          name={'provinsi'}
                          type={'text'}
                          placeholder={'Provinsi'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Kabupaten/Kota'}
                          name={'kabupatenKota'}
                          type={'text'}
                          placeholder={'Kabupaten/Kota'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Kecamatan'}
                          name={'kecamatan'}
                          type={'text'}
                          placeholder={'Kecamatan'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Kelurahan/Desa'}
                          name={'kelurahanDesa'}
                          type={'text'}
                          placeholder={'Kelurahan/Desa'}
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