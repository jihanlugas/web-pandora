import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CgPushChevronRight, CgPushChevronLeft, CgChevronRight, CgChevronLeft } from 'react-icons/cg';
import { FaSortAmountDownAlt, FaSortAmountDown } from 'react-icons/fa';
import { PageInfo, Paging } from '@/types/pagination';

type Props = {
  columns: any[],
  data: any[],
  pageRequest: Paging & any,
  setPageRequest: Dispatch<SetStateAction<Paging & any>>,
  pageInfo: PageInfo,
  isLoading: boolean,
}

const Table: React.FC<Props> = ({ columns, data, setPageRequest, pageRequest, pageInfo, isLoading }) => {

  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, []);

  // const [sorting, setSorting] = React.useState<SortingState>([])

  const refRows = useRef<HTMLDivElement>();
  const [rowsBar, setRowsBar] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState({})

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (rowsBar && refRows.current && !refRows.current.contains(e.target)) {
        setRowsBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [rowsBar]);

  const table = useReactTable({
    columns: columnsMemo,
    data: dataMemo,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  const handleChangeLimit = (limit: number) => {
    setPageRequest({ ...pageRequest, limit, page: 1 });
    setRowsBar(!rowsBar);
  };

  const handleSort = (sortField) => {
    // console.log('sortField ', sortField)
    if (pageRequest.sortField !== sortField) {
      setPageRequest({
        ...pageRequest,
        sortField,
        sortOrder: "asc",
        page: 1,
      });
    } else {
      if ((pageRequest.sortOrder === 'asc')) {
        setPageRequest({
          ...pageRequest,
          sortField,
          sortOrder: "desc",
          page: 1,
        });
      } else if ((pageRequest.sortOrder === 'desc')) {
        setPageRequest({
          ...pageRequest,
          sortField: null,
          sortOrder: null,
          page: 1,
        });
      }
    }
  }

  // console.log("table.getAllLeafColumns() ", JSON.stringify(table.getAllLeafColumns()))
  // console.log("table.getAllLeafColumns() ", table.getAllLeafColumns())

  return (
    <>
      {/* {table.getAllLeafColumns().map(column => {
        return (
          <div key={column.id} className="px-1">
            <label>
              <input
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />{' '}
              {column.columnDef.header as string}
            </label>
          </div>
        )
      })} */}
      <table className='w-full table-auto text-sm mb-2'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='border-b border-t text-left'>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id} className='py-2 font-normal text-base whitespace-nowrap'
                    colSpan={header.colSpan}
                  // style={{
                  //   width: header.getSize(),
                  // }}
                  >
                    {!header.isPlaceholder && (
                      <>{header.column.getCanSort() ? (
                        <div
                          className='p-2 cursor-pointer select-none flex justify-between items-center hover:bg-gray-100 rounded duration-300'
                          onClick={() => handleSort(header.id)}
                        >
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                          {header.id === pageRequest.sortField ? (
                            <>
                              {pageRequest.sortOrder === 'asc' ? (
                                <div className='ml-2'>
                                  <FaSortAmountDownAlt size={'1.0rem'} className={'text-primary-600'} />
                                </div>
                              ) : (
                                <div className='ml-2'>
                                  <FaSortAmountDown size={'1.0rem'} className={'text-primary-600'} />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className='ml-2'>
                              <FaSortAmountDownAlt size={'1.0rem'} className={'text-gray-400'} />
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className='p-2'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <>
              {Array.apply(null, Array(pageRequest.limit)).map((data, key) => (
                <React.Fragment key={key}>
                  {table.getHeaderGroups().map((headerGroup, key) => (
                    <tr key={key} className='border-b text-left '>
                      {headerGroup.headers.map((column, key) => (
                        <td key={key} className='py-4 px-2 font-normal whitespace-nowrap animate-pulse'>
                          <div className='h-3 w-full bg-slate-200 rounded-full'></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-b text-left'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='py-2 px-2 font-normal'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <div className='flex justify-between items-center'>
        <div className='flex items-center px-2'>
          <div className='mr-2'>{'Page ' + pageInfo.page}</div>
        </div>
        <div className='flex items-center justify-end px-2'>
          <div className='relative mx-4' ref={refRows}>
            <div className='flex items-center'>
              <div className='mr-2'>{'Rows per page: '}</div>
              <button className='size-8 flex justify-center items-center duration-300 bg-gray-100 hover:shadow rounded' onClick={() => setRowsBar(!rowsBar)}>
                {pageRequest.limit}
              </button>
            </div>
            <div className={`absolute -top-40 -right-4 w-12 rounded-md overflow-hidden origin-bottom-left shadow-lg bg-white ring-black duration-300 ease-in-out ${!rowsBar && 'scale-0 shadow-none ring-0'}`}>
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(10)}>{'10'}</button>
              <hr />
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(25)}>{'25'}</button>
              <hr />
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(50)}>{'50'}</button>
              <hr />
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(100)}>{'100'}</button>
            </div>
          </div>
          <div className='w-32 flex justify-center mx-4'>
            <span className='mx-1'>{'Data'}</span>
            <span>{pageInfo.totalData > 0 ? ((pageInfo.page - 1) * pageInfo.pageSize) + 1 : 0}</span>
            <span className='mx-1'>{'-'}</span>
            <span>{pageInfo.page * pageInfo.pageSize < pageInfo.totalData ? pageInfo.page * pageInfo.pageSize : pageInfo.totalData}</span>
            <span className='mx-1'>{'of'}</span>
            <span>{pageInfo.totalData}</span>
          </div>
          <div className='flex items-center ml-4'>
            <button className='size-8 flex justify-center items-center rounded ml-2 duration-300 bg-gray-100 hover:shadow disabled:shadow-none disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: 1 })}>
              <CgPushChevronLeft size={'1.5rem'} className={''} />
            </button>
            <button className='size-8 flex justify-center items-center rounded ml-2 duration-300 bg-gray-100 hover:shadow disabled:shadow-none disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page - 1 })}>
              <CgChevronLeft size={'1.5rem'} className={''} />
            </button>
            <button className='size-8 flex justify-center items-center rounded ml-2 duration-300 bg-gray-100 hover:shadow disabled:shadow-none disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page + 1 })}>
              <CgChevronRight size={'1.5rem'} className={''} />
            </button>
            <button className='size-8 flex justify-center items-center rounded ml-2 duration-300 bg-gray-100 hover:shadow disabled:shadow-none disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageInfo.pageCount })}>
              <CgPushChevronRight size={'1.5rem'} className={''} />
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Table;