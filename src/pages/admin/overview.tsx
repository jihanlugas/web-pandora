import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import { Store } from 'react-notifications-component';
import MainAuth from '@/components/layout/main-auth';
import Notif from '@/utils/notif';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Index = () => {
  const router = useRouter()
  router.replace('/admin/user')

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Overview'}</title>
      </Head>
      <div className='p-4'>
        Overview
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;