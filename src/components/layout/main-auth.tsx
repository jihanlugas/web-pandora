import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { AiOutlineLoading } from 'react-icons/ai'
import Notif from '@/utils/notif';
import { MENU_ADMIN, MENU_USER, USER_ROLE_ADMIN, USER_ROLE_USER } from '@/utils/constant';
import LoginContext from '@/stores/login-provider';


type Props = {
  children: React.ReactNode
}

const Loading: React.FC = () => {
  return (
    <>
      <div className='h-dvh w-screen flex justify-center items-center'>
        <AiOutlineLoading className={'absolute animate-spin '} size={'6em'} />
      </div>
    </>
  )
}

const MainAuth: React.FC<Props> = ({ children }) => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  const [refreshInterval, setRefreshInteval] = useState(0)

  const { login, setLogin } = useContext(LoginContext);

  const router = useRouter();

  const { data, mutate: mutateInit, isPending } = useMutation({
    mutationKey: ['init'],
    mutationFn: () => Api.get('/init')
  });
  const { mutate: mutateRefreshToken } = useMutation({
    mutationKey: ['refresh-token'],
    mutationFn: () => Api.get('/refresh-token')
  });

  const onClickOverlay = (isShow: boolean) => {
    if (isShow === undefined) {
      setSidebar(!sidebar);
    } else {
      setSidebar(isShow);
    }
  };

  useEffect(() => {
    if (login) {
      if (login.role === USER_ROLE_USER) {
        const menuIndex = MENU_USER.findIndex((menu) => router.pathname.indexOf(menu.path))
        if (menuIndex === -1) {
          router.push('/overview')
        }
      }
    }

    onClickOverlay(false);
  }, [router.pathname]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.clear()
      router.push({
        pathname: '/sign-in',
        query: {
          redirect: router.asPath && router.asPath,
        }
      });
    } else {
      let interval = 1000 * 60 * (process.env.REFRESH_TOKEN_MINUTES as unknown as number)
      setTimeout(() => {
        setRefreshInteval(refreshInterval + 1)
        mutateRefreshToken(null, {
          onSuccess: (res) => {
            if (res) {
              if (res.status) {
                localStorage.setItem('token', res.payload.token)
              } else {
                Notif.error(res.message)
              }
            } else {
              localStorage.clear()
              router.push({
                pathname: '/sign-in',
                query: {
                  redirect: router.asPath && router.asPath,
                }
              });
            }
          },
          onError: () => {
            localStorage.clear()
            router.push({
              pathname: '/sign-in',
              query: {
                redirect: router.asPath && router.asPath,
              }
            });
          }
        });
      }, interval)
    }
  }, [refreshInterval])

  useEffect(() => {
    mutateInit(null, {
      onSuccess: (res) => {
        setInit(true)
        if (res) {
          if (res.status) {
            setLogin(res.payload)
          }
        }
      },
      onError: () => {
        router.push('/sign-in');
      }
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="theme-color" content={'currentColor'} />
      </Head>
      <main className={''}>
        {init && login ? (
          <>
            <Header sidebar={sidebar} setSidebar={setSidebar} />
            <Sidebar role={login.role} sidebar={sidebar} onClickOverlay={onClickOverlay} />
            <div className={`hidden md:block duration-300 ease-in-out pt-16 overflow-y-auto`}>
              <div className="mainContent">
                {children}
              </div>
            </div>
            <div className={'block md:hidden pt-16 overflow-y-auto'}>
              <div className="mainContent">
                {children}
              </div>
            </div>

          </>
        ) : (
          <>
            <Loading />
          </>
        )}
      </main>
    </>
  );
};

export default MainAuth;