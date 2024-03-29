import MainAuth from "@/components/layout/main"
import { Api } from "@/lib/api"
import { KtpView } from "@/types/ktp"
import PageWithLayoutType from "@/types/layout"
import Head from "next/head"
import Link from "next/link"
import { GetServerSideProps, NextPage } from "next/types"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"


type Props = {
  ktp: KtpView
}

const Index: NextPage<Props> = ({ ktp }) => {
  return (
    <>
      <Head>
        <title>{'KTP - ' + ktp.nama}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/ktp'}>
                <div className='mr-4 hover:text-primary-500'>{'KTP'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{ktp.nama}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/ktp'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{ktp.nama}</div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className="">{ktp.id}</div>
          <div className="">{ktp.nik}</div>
          <div className="">{ktp.nama}</div>
          <div className="">{ktp.tempatLahir}</div>
          <div className="">{ktp.tanggalLahir}</div>
          <div className="">{ktp.jenisKelamin}</div>
          <div className="">{ktp.provinceName}</div>
          <div className="">{ktp.districtName}</div>
          <div className="">{ktp.regencyName}</div>
          <div className="">{ktp.villageName}</div>
          <div className="">{ktp.alamat}</div>
          <div className="">{ktp.rtrw}</div>
          <div className="">{ktp.pekerjaan}</div>
          <div className="">{ktp.statusPerkawinan}</div>
          <div className="">{ktp.kewarganegaraan}</div>
          <div className="">{ktp.berlakuHingga}</div>
          <div className="">{ktp.photoId}</div>
          <div className="">{ktp.createBy}</div>
          <div className="">{ktp.createDt}</div>
          <div className="">{ktp.updateBy}</div>
          <div className="">{ktp.updateDt}</div>
          <div className="">{ktp.deleteDt}</div>
          <div className="">{ktp.createName}</div>
          <div className="">{ktp.updateName}</div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

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

export default Index;