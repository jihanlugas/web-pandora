import moment from 'moment';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import DateField from '@/components/formik/date-field';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import MainAdmin from '@/components/layout/main-admin';
import Head from 'next/head';
import { NextPage } from 'next/types';
import Link from 'next/link';
import { MdOutlineFilterList } from 'react-icons/md';
import { VscTrash } from 'react-icons/vsc';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BiFilterAlt, BiLayerPlus, BiPlus } from 'react-icons/bi';
import { RiPencilLine } from 'react-icons/ri';
import { IoAddOutline } from 'react-icons/io5';
import Table from '@/components/table/table';
// import ModalFilterUser from '@/components/modal/modal-filter-user';
import { useRouter } from 'next/router';
import { displayActive, displayMoney, displayNumber, displayPhoneNumber } from '@/utils/formater';
// import ModalDelete from '@/components/modal/modal-delete';
import notif from '@/utils/notif';
import { UserView, PageUser } from '@/types/user';
import { PageInfo } from '@/types/pagination';

type Props = {

}

const Index: NextPage<Props> = () => {

  const router = useRouter();

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [user, setUser] = useState<UserView[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestUser, setPageRequestUser] = useState<PageUser>({
    limit: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    fullname: '',
    email: '',
    noHp: '',
    username: '',
    createBy: '',
  });

  const column: ColumnDef<UserView>[] = [
    {
      id: 'fullname',
      accessorKey: 'fullname',
      header: 'Fullname',
      // header: (props) => {
      //   return (
      //     <>
      //       <div className='whitespace-nowrap'>
      //         {"Fullname"}
      //       </div>
      //     </>
      //   );
      // },
      cell: (props) => {
        return (
          <Link href={{ pathname: '/admin/user/[userId]', query: { userId: props.row.original.id } }} >
            <div className='w-full duration-300 hover:text-primary-500'>
              {props.getValue() as string}
            </div>
          </Link>
        )
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      cell: props => props.getValue(),
    },
    {
      id: 'no_hp',
      accessorKey: 'noHp',
      header: 'No. Hp',
      cell: props => displayPhoneNumber(props.getValue() as string),
    },
    {
      id: 'role',
      accessorKey: 'role',
      enableSorting: false,
      header: 'Role',
      cell: props => props.getValue(),
    },
    {
      id: 'is_active',
      accessorKey: 'isActive',
      enableSorting: false,
      header: 'Active',
      cell: props => displayActive(props.getValue() as boolean),
    },
    {
      id: 'pass_version',
      accessorKey: 'passVersion',
      enableSorting: false,
      header: 'Pass Version',
      cell: props => props.getValue(),
    },
    {
      id: 'create_name',
      accessorKey: 'createName',
      enableSorting: false,
      header: 'Create By',
      cell: props => props.getValue(),
    },
    {
      id: 'id',
      header: 'Action',
      enableSorting: false,
      cell: (props) => {
        return (
          <>
            <div className='flex justify-end items-center'>
              <Link href={{ pathname: '/admin/user/[userId]/edit', query: { userId: props.row.original.id } }} title='edit'>
                <div className='ml-2 h-8 w-8 flex justify-center items-center duration-300 bg-gray-100 hover:shadow rounded'>
                  <RiPencilLine className='' size={'1.2rem'} />
                </div>
              </Link>
              <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 bg-gray-100 hover:shadow rounded' title='delete' onClick={() => toggleDelete(props.row.original.id)}>
                <VscTrash className='' size={'1.2rem'} />
              </button>
            </div>
          </>
        );
      },

    }
  ];

  // const { isLoading, data, refetch } = useQuery(['user', pageRequestUser], ({ queryKey }) => Api.get('/user/page', queryKey[1]), {});
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['user', pageRequestUser],
    queryFn: ({ queryKey }) => Api.get('/user/page', queryKey[1]),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['delete-user', deleteId],
    mutationFn: (id: string) => Api.delete('/user/' + id)
  });

  useEffect(() => {
    if (data && data.status) {
      setUser(data.payload.list);
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
        <title>{process.env.APP_NAME + ' - User'}</title>
      </Head>
      {/* <ModalFilterUser
        onClickOverlay={toggleFilter}
        show={showModalFilter}
        pageRequestUser={pageRequestUser}
        setPageRequestUser={setPageRequestUser}
      />
      <ModalDelete
        onClickOverlay={toggleDelete}
        show={showModalDelete}
        onDelete={handleDelete}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this user will also be deleted</div>
        </div>
      </ModalDelete> */}
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            User
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
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 bg-gray-100 hover:shadow' onClick={() => toggleFilter()}>
                    <BiFilterAlt className='' size={'1.2em'} />
                  </button>
                </div>
                <div className='ml-2'>
                  <Link href={{ pathname: '/admin/user/new' }}>
                    <div className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 bg-gray-100 hover:shadow'>
                      <BiPlus className='' size={'1.2em'} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={user}
                setPageRequest={setPageRequestUser}
                pageRequest={pageRequestUser}
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

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;