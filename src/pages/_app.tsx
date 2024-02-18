import 'react-notifications-component/dist/theme.css'
import 'react-datetime/css/react-datetime.css';
// import 'animate.css/animate.min.css';
import '../styles/globals.css'
import Head from 'next/head';
import { NextPage } from 'next/types';
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageWithLayoutType from '@/types/layout';
import { ReactNotifications } from 'react-notifications-component'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LoginContextProvider } from '@/stores/login-provider';


type AppLayoutProps = {
  Component: PageWithLayoutType
  pageProps: any
}

const MyApp: NextPage<AppLayoutProps> = ({ Component, pageProps }) => {

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const queryClient = new QueryClient();

  return (
    <>
      <ReactNotifications />
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <LoginContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LoginContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default MyApp;
