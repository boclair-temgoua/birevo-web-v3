/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import { KTSVG } from '../../../_metronic/helpers'
import { useSearchParams } from 'react-router-dom'
import { HelmetSite } from '../utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth'
import { useDebounce } from '../utils/use-debounce'
import { getProjectsContributes } from './core/_requests'
import { PaginationItem } from '../utils/pagination-item'
import { EmptyTable } from '../utils/empty-table'
import ProjectList from './hook/ProjectList'
import { ContributorModel } from '../contributors/core/_models'
import { ProjectCreateFormModal } from './hook/ProjectCreateFormModal'
import { SearchInput } from '../utils/forms/SearchInput'

const ProjectsWrapper: FC = () => {
  const [openCreateOrUpdateModal, setOpenCreateOrUpdateModal] = useState<boolean>(false)
  const { organization } = useAuth() as any
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams();
  const [pageItem, setPageItem] = useState(Number(searchParams.get('page')) || 1)
  const [filter, setFilter] = useState<string>('')

  const debouncedFilter = useDebounce(filter, 500);
  const isEnabled = Boolean(debouncedFilter)
  const fetchData = async (pageItem = 1, debouncedFilter: string) => await
    getProjectsContributes({
      search: debouncedFilter,
      take: 10,
      page: Number(pageItem || 1),
      sort: 'DESC'
    })
  const {
    isLoading,
    isError,
    data,
    isPreviousData,
  } = useQuery(['projects', pageItem, 'DESC', debouncedFilter], () => fetchData(pageItem, debouncedFilter), {
    enabled: filter ? isEnabled : !isEnabled,
    keepPreviousData: true,
    staleTime: 5000
  })

  // Prefetch the next page!
  useEffect(() => {
    if (data?.data?.total_page !== pageItem) {
      queryClient.prefetchQuery
        (['projects', pageItem + 1], () =>
          fetchData(pageItem + 1, debouncedFilter)
        )
    }
  }, [data?.data, pageItem, queryClient, debouncedFilter])

  const paginate = (pageItem: number) => {
    setPageItem(pageItem)
  }

  const dataTable = isLoading ? (<tr><td><strong>Loading...</strong></td></tr>) :
    isError ? (<tr><td><strong>Error find data please try again...</strong></td></tr>) :
      (data?.data?.total <= 0) ? (<EmptyTable name='project' />) :
        (
          data?.data?.value?.map((item: ContributorModel, index: number) => (
            <ProjectList item={item} key={index} />
          )))

  return (
    <>
      <HelmetSite title={`${organization?.name || ''}`} />
      <PageTitle breadcrumbs={[{
        title: `${organization?.name || 'Projects'} |`,
        path: '/projects',
        isSeparator: false,
        isActive: false,
      }]}>Projects</PageTitle>


      <div className={`card mb-5 mb-xl-8`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Projects</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>Over {data?.data?.total || 0} projects</span>
          </h3>
          <div
            className='card-toolbar'
            title='Click to add a user'
          >
            <button type="button" onClick={() => { setOpenCreateOrUpdateModal(true) }} className="btn btn-sm btn-light-primary me-1">
              <KTSVG path='/media/icons/duotune/abstract/abs011.svg' className='svg-icon-3' />
              New Project
            </button>
          </div>
        </div>
        <div className="card-header border-0 pt-5">
          <SearchInput className='d-flex align-items-center form-control-solid position-relative my-1'
            classNameInput='form-control w-250px ps-14'
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFilter(e.target.value)}
            placeholder='Search by name' />
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className="fw-bolder fs-6 text-muted">
                  <th>Name</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {dataTable}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>

          <PaginationItem
            data={data}
            setPageItem={setPageItem}
            setPreviewPageItem={(old: number) => Math.max(old - 1, 1)}
            setNextPageItem={(old: number) => old + 1}
            paginate={paginate}
            isPreviousData={isPreviousData}
            pageItem={pageItem}
          />

          {openCreateOrUpdateModal && (<ProjectCreateFormModal setOpenCreateOrUpdateModal={setOpenCreateOrUpdateModal} />)}
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
    </>
  )
}

export default ProjectsWrapper
