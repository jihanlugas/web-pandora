import MainAdmin from "@/components/layout/main-admin"
import { Api } from "@/lib/api"
import { KtpView, UpdateKtp } from "@/types/ktp"
import PageWithLayoutType from "@/types/layout"
import { useMutation } from "@tanstack/react-query"
import { Form, Formik, FormikValues } from "formik"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { GetServerSideProps, NextPage } from "next/types"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import * as Yup from 'yup';
import notif from '@/utils/notif';
import TextField from "@/components/formik/text-field"
import DateField from "@/components/formik/date-field"
import DropdownField from "@/components/formik/dropdown-field"
import { GENDER, STATUS_PERKAWINAN } from "@/utils/constant"
import ButtonSubmit from "@/components/formik/button-submit"
import { displayDateForm } from "@/utils/formater"

type Props = {
  ktp: KtpView
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

const Edit: NextPage<Props> = ({ ktp }) => {
  const router = useRouter();
  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['update-ktp', ktp.id],
    mutationFn: (val: FormikValues) => Api.put('/ktp/' + ktp.id, val),
  });

  const initFormikValue: UpdateKtp = {
    nik: ktp.nik,
    nama: ktp.nama,
    tempatLahir: ktp.tempatLahir,
    tanggalLahir: displayDateForm(ktp.tanggalLahir),
    jenisKelamin: ktp.jenisKelamin,
    alamat: ktp.alamat,
    rtrw: ktp.rtrw,
    kelurahanDesa: ktp.kelurahanDesa,
    kecamatan: ktp.kecamatan,
    kabupatenKota: ktp.kabupatenKota,
    provinsi: ktp.provinsi,
    pekerjaan: ktp.pekerjaan,
    statusPerkawinan: ktp.statusPerkawinan,
    kewarganegaraan: ktp.kewarganegaraan,
    berlakuHingga: ktp.berlakuHingga,
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
        <title>{'KTP - ' + ktp.nama}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/admin/ktp'}>
                <div className='mr-4 hover:text-primary-500'>{'KTP'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <Link href={{ pathname: '/admin/ktp/[ktpId]', query: { ktpId: ktp.id } }}>
                <div className='mr-4 hover:text-primary-500'>{ktp.nama}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{"Edit"}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={{ pathname: '/admin/ktp/[ktpId]', query: { ktpId: ktp.id } }}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{"Edit"}</div>
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
                          label={'Save'}
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

(Edit as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ktpId } = context.query;
  const ktp = await Api.get('/ktp/' + ktpId).then(res => res);

  if (ktp.status) {
    return {
      props: {
        ktp: ktp.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Edit;