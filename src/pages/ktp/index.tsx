import moment from 'moment';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import DateField from '@/components/formik/date-field';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import MainKtp from '@/components/layout/main-admin';
import Head from 'next/head';
import { NextPage } from 'next/types';
import Link from 'next/link';
import { MdOutlineFilterList } from 'react-icons/md';
import { VscTrash } from 'react-icons/vsc';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { BiFilterAlt, BiLayerPlus } from 'react-icons/bi';
import { RiPencilLine } from 'react-icons/ri';
import { IoAddOutline } from 'react-icons/io5';
import Table from '@/components/table/table';
// import ModalFilterKtp from '@/components/modal/modal-filter-ktp';
import { useRouter } from 'next/router';
import { displayActive, displayDate, displayMoney, displayNumber, displayPhoneNumber } from '@/utils/formater';
// import ModalDelete from '@/components/modal/modal-delete';
import notif from '@/utils/notif';
import { KtpView, PageKtp } from '@/types/ktp';
import { PageInfo } from '@/types/pagination';

type Props = {

}

const Index: NextPage<Props> = () => {

  const router = useRouter();

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [ktp, setKtp] = useState<KtpView[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestKtp, setPageRequestKtp] = useState<PageKtp>({
    limit: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    nik: '',
    nama: '',
    alamat: '',
    kelurahanDesa: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    statusPerkawinan: '',
    kewarganegaraan: '',
    createBy: '',
  });

  const column: ColumnDef<KtpView>[] = [
    {
      id: 'nik',
      accessorKey: 'nik',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"NIK"}
            </div>
          </>
        );
      },
      cell: (props) => {
        return (
          <Link href={{ pathname: '/admin/ktp/[ktpId]', query: { ktpId: props.row.original.id } }} >
            <div className='w-full duration-300 hover:text-primary-500'>
              {props.getValue() as string}
            </div>
          </Link>
        )
      },
    },
    {
      id: 'nama',
      accessorKey: 'nama',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Nama"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'ttl',
      accessorKey: 'ttl',
      enableSorting: false,
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Tempat/Tanggal Lahir"}
            </div>
          </>
        );
      },
      cell: (props) => {
        return (
            <div className='w-full duration-300 hover:text-primary-500'>
              {props.row.original.tempatLahir + ', ' + displayDate(props.row.original.tanggalLahir)}
            </div>
        )
      },
    },
    {
      id: 'provinsi',
      accessorKey: 'provinsi',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Kabutapen/Kota"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'kabupaten_kota',
      accessorKey: 'kabupatenKota',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Kabutapen/Kota"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'kecamatan',
      accessorKey: 'kecamatan',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Kecamatan"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'kelurahan_desa',
      accessorKey: 'kelurahanDesa',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Kelurahan/Desa"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    // {
    //   id: 'id',
    //   header: 'Action',
    //   enableSorting: false,
    //   cell: (props) => {
    //     return (
    //       <>
    //         <div className='flex justify-end items-center'>
    //           <Link href={{ pathname: '/admin/ktp/[ktpId]/edit', query: { ktpId: props.row.original.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
    //             <RiPencilLine className='' size={'1.2rem'} />
    //           </Link>
    //           <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDelete(props.row.original.id)}>
    //             <VscTrash className='' size={'1.2rem'} />
    //           </button>
    //         </div>
    //       </>
    //     );
    //   },
    // }
  ];

  // const { isLoading, data, refetch } = useQuery(['ktp', pageRequestKtp], ({ queryKey }) => Api.get('/ktp/page', queryKey[1]), {});
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['ktp', pageRequestKtp],
    queryFn: ({ queryKey }) => Api.get('/ktp/page', queryKey[1]),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['delete-ktp', deleteId],
    mutationFn: (id: string) => Api.delete('/ktp/' + id)
  });

  useEffect(() => {
    if (data && data.status) {
      setKtp(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  const toggleFilter = () => {
    setShowModalFilter(!showModalFilter)
  };

  const toggleDelete = (id = '') => {
    setDeleteId(id);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeleteId('');
            toggleDelete('');
            refetch();
          } else if (!res.status) {
            notif.error(res.message);
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
        <title>{process.env.APP_NAME + ' - Ktp'}</title>
      </Head>
      {/* <ModalFilterKtp
        onClickOverlay={toggleFilter}
        show={showModalFilter}
        pageRequestKtp={pageRequestKtp}
        setPageRequestKtp={setPageRequestKtp}
      />
      <ModalDelete
        onClickOverlay={toggleDelete}
        show={showModalDelete}
        onDelete={handleDelete}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this ktp will also be deleted</div>
        </div>
      </ModalDelete> */}
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            Ktp
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-2'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => toggleFilter()}>
                    <BiFilterAlt className='' size={'1.2em'} />
                  </button>
                </div>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => router.push('/admin/ktp/new')}>
                    <IoAddOutline className='' size={'1.2em'} />
                  </button>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={ktp}
                setPageRequest={setPageRequestKtp}
                pageRequest={pageRequestKtp}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainKtp;

export default Index;