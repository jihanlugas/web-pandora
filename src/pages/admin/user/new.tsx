import MainAdmin from '@/components/layout/main-admin';
import { Api } from '@/lib/api';
import { CreateUser } from '@/types/user';
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


type Props = {
}

const schema = Yup.object().shape({
  fullname: Yup.string().required("Required field"),
  email: Yup.string().email().required("Required field"),
  noHp: Yup.string().required("Required field"),
  username: Yup.string().matches(/^[a-zA-Z0-9_-]*$/, "Character not allowed").min(6).required("Required field"),
  passwd: Yup.string().min(6).required("Required field"),
});

const New: NextPage<Props> = () => {
  const router = useRouter();

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['create-user'],
    mutationFn: (val: FormikValues) => Api.post('/user', val),
  });

  const initFormikValue: CreateUser = {
    fullname: '',
    email: '',
    noHp: '',
    username: '',
    passwd: '',
  };

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push('/admin/user');
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
        <title>{process.env.APP_NAME + ' - User New'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/admin/user'}>
                <div className='mr-4 hover:text-primary-500'>{'User'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/admin/user'}>
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
            <div className='text-xl'>Create User</div>
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
                          label={'Fullname'}
                          name={'fullname'}
                          type={'text'}
                          placeholder={'Fullname'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'text'}
                          placeholder={'Email'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'No. Handphone'}
                          name={'noHp'}
                          type={'text'}
                          placeholder={'No. Handphone'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Username'}
                          name={'username'}
                          type={'text'}
                          placeholder={'username'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'User Password'}
                          name={'passwd'}
                          type={'password'}
                          placeholder={'User Password'}
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