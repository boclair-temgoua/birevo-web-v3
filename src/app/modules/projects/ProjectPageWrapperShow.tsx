import { FC, useEffect, useState } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import { HelmetSite } from '../utils'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOneProject } from './core/_requests'
import { useAuth } from '../auth'
import { SubProjectTableMini } from '../sub-projects/SubProjectTableMini'
import { ContactProjectTableMini } from '../contacts/ContactProjectTableMini'
import { ContributorProjectTableMini } from '../contributors/ContributorProjectTableMini'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { DocumentTableMini } from '../documents/DocumentTableMini'
import { Dropdown1 } from '../../../_metronic/partials'
import ContributorMiniList from '../contributors/hook/ContributorMiniList'
import { getContributorsProject } from '../contributors/core/_requests'
import { ContributorModel } from '../contributors/core/_models'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectModel } from './core/_models'
import { IsLoadingHeader } from '../utils/is-loading/is-loading-header'

const ProjectPageWrapperShow: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const takeValue: number = 6
  const { projectId } = useParams<string>()

  const fetchOneProject = async () => await getOneProject({ projectId: String(projectId) })
  const {
    data: projectItem,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchOneProject(),
    enabled: Boolean(projectId),
  })



  return (
    <>
      <HelmetSite title={`${projectItem?.data?.name || 'Project'}`} />
      <PageTitle
        breadcrumbs={[
          {
            title: `${projectItem?.data?.name || 'Project'} |`,
            path: `/projects/${projectId}`,
            isSeparator: false,
            isActive: false,
          },
        ]}
      >
        Project
      </PageTitle>

      {isLoading ?
        <>
          <IsLoadingHeader />
        </> :
        <>

          <ProjectHeader project={projectItem?.data as ProjectModel} />
        </>}


      {/* <div className='row g-5 g-xl-8'>

        <div className='col-xl-3'>
          <Link to={`/projects/${projectId}?tab=${'projects'}`} className='card hoverable card-xl-stretch mb-5 mb-xl-8'>
            <div className='card-header pt-5'>
              <div className='card-title d-flex flex-column'>
                <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>{projectItem?.data?.subProjectTotal || 0}</span>
                <span className='text-gray-400 pt-1 fw-semibold fs-6'>Projects</span>
              </div>
            </div>
            <div className='card-body d-flex flex-column justify-content-end pe-0'>
              <div className='text-dark fw-bold fs-2 mb-2 mt-5'>{projectItem?.data?.name}</div>
              <div className='fw-semibold text-dark'>{projectItem?.data?.description}</div>
            </div>
          </Link>
        </div>

        <div className='col-xl-3'>
          <Link to={`/projects/${projectId}?tab=${'documents'}`} className='card hoverable card-xl-stretch mb-5 mb-xl-8'>
            <div className='card-header pt-5'>
              <div className='card-title d-flex flex-column'>
                <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>{projectItem?.data?.documentTotal || 0}</span>
                <span className='text-gray-400 pt-1 fw-semibold fs-6'>Documents</span>
              </div>
            </div>
            <div className='card-body d-flex flex-column justify-content-end pe-0'>
              <div className='text-dark fw-bold fs-2 mb-2 mt-5'>Documents</div>
              <div className='fw-semibold text-dark'>Documents {projectItem?.data?.name}</div>
            </div>
          </Link>
        </div>

        <div className='col-xl-3'>
          <Link to={`/projects/${projectId}?tab=${'contributors'}`} className='card hoverable card-xl-stretch mb-5 mb-xl-8'>
            <div className='card-header pt-5'>
              <div className='card-title d-flex flex-column'>
                <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>{projectItem?.data?.contributorTotal || 0}</span>
                <span className='text-gray-400 pt-1 fw-semibold fs-6'>Contributors</span>
              </div>
            </div>
            <div className='card-body d-flex flex-column justify-content-end pe-0'>
              <div className='symbol-group symbol-hover flex-nowrap'>
                {dataContributorMiniTable}

                {calculatedContributors > 0 && (
                  <span className='symbol symbol-35px symbol-circle'>
                    <span className='symbol-label bg-dark text-inverse-dark fs-8 fw-bold'>
                      +{calculatedContributors}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        <div className='col-xl-3'>
          <Link to={`/projects/${projectId}?tab=${'contacts'}`} className='card hoverable card-xl-stretch mb-5 mb-xl-8'>
            <div className='card-header pt-5'>
              <div className='card-title d-flex flex-column'>
                <span className='fs-2hx fw-bold text-dark me-2 lh-1 ls-n2'>{projectItem?.data?.contactTotal || 0}</span>
                <span className='text-gray-400 pt-1 fw-semibold fs-6'>Contacts</span>
              </div>
            </div>
            <div className='card-body d-flex flex-column justify-content-end pe-0'>
              <div className='text-dark fw-bold fs-2 mb-2 mt-5'>Contacts</div>
              <div className='fw-semibold text-dark'>Contacts {projectItem?.data?.name}</div>
            </div>
          </Link>
        </div>

      </div> */}



      {projectItem?.data?.id && (
        <>
          {searchParams.get('tab') === 'projects' && (
            <SubProjectTableMini project={projectItem?.data} />
          )}

          {/* {searchParams.get('tab') === 'documents' && (
            <DocumentTableMini type='PROJECT' projectItem={projectItem?.data} projectId={projectItem?.data?.id} />
          )}

          {searchParams.get('tab') === 'contributors' && (
            <ContributorProjectTableMini project={projectItem?.data} />
          )}

          {searchParams.get('tab') === 'contacts' && (
            <ContactProjectTableMini project={projectItem?.data} takeValue={takeValue} />
          )} */}
        </>
      )}

      {/* {projectItem?.data?.role?.name === 'ADMIN' && (
        <div className='card  '>
          <div className='card-header border-0 cursor-pointer'>
            <div className='card-title m-0'>
              <h3 className='fw-bold m-0'>Delete: {projectItem?.data?.name || 'Project'}</h3>
            </div>
          </div>
          <div id='kt_account_settings_deactivate' className='collapse show'>
            <form
              id='kt_account_deactivate_form'
              className='form fv-plugins-bootstrap5 fv-plugins-framework'
            >
              <div className='card-footer d-flex justify-content-end py-6 px-9'>
                <button type='submit' className='btn btn-sm btn-danger fw-semibold'>
                  <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />{' '}
                  Delete
                </button>
              </div>

              <input type='hidden' />
            </form>
          </div>
        </div>
      )} */}
    </>
  )
}

export default ProjectPageWrapperShow
