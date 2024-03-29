/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'
import { ContributorModel, arrayAuthorized } from '../../contributors/core/_models'
// import { getContributorssubProject } from '../../contributors/core/_requests'
import ContributorMiniList from '../../contributors/hook/ContributorMiniList'
import { useQuery } from '@tanstack/react-query'
import { getContributorsSubSubProject } from '../../contributors/core/_requests'
import Swal from 'sweetalert2';
import { AlertDangerNotification, AlertSuccessNotification, colorRole } from '../../utils'

// import { SubProjectCreateFormModal } from './SubProjectCreateFormModal'
import { SubProjectModel } from '../../sub-projects/core/_models'
import { SubSubProjectCreateFormModal } from './SubSubProjectCreateFormModal'
import { DeleteOneSubSubProjectMutation } from '../core/_models'
import { formateDateDayjs } from '../../utils/formate-date-dayjs'
import { InviteContributorFormModal } from '../../contributors/hook/InviteContributorFormModal'

type Props = {
    item?: ContributorModel;
    subProject?: SubProjectModel;
}

const SubSubProjectList: React.FC<Props> = ({ item, subProject }) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openCreateOrUpdateModal, setOpenCreateOrUpdateModal] = useState<boolean>(false)
    const navigate = useNavigate();


    const fetchDataContributorMini = async () => await getContributorsSubSubProject({ take: 10, page: 1, sort: 'ASC', subSubProjectId: String(item?.subSubProjectId) })
    const { isLoading: isLoadingContributor, isError: isErrorContributor, data: dataContributorMini } = useQuery({
        queryKey: ['contributorSubSubProjectMini', item?.subSubProjectId, 1, 'ASC'],
        queryFn: () => fetchDataContributorMini(),
    })
    const dataContributorMiniTable = isLoadingContributor ? (<strong>Loading...</strong>) :
        isErrorContributor ? (<strong>Error find data please try again...</strong>) :
            (dataContributorMini?.data?.total <= 0) ? ('') :
                (
                    dataContributorMini?.data?.value?.map((item: ContributorModel, index: number) => (
                        <ContributorMiniList item={item} key={index} />
                    )))


    const actionDeleteOneSubSubProjectMutation = DeleteOneSubSubProjectMutation({
        onSuccess: () => { },
        onError: (error) => { }
    });


    const deleteItem = async (item: any) => {
        Swal.fire({
            title: 'Delete?',
            html: `<b>${item?.subSubProject?.name}</b><br/><br/>
            <b>Confirm with your password</b> `,
            confirmButtonText: 'Yes, Deleted',
            cancelButtonText: 'No, Cancel',
            footer: `<b>Delete: ${item?.subSubProject?.name}</b>`,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-sm btn-danger',
                cancelButton: 'btn btn-sm btn-primary',
            },
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off',
                required: 'true'
            },
            showCancelButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            inputPlaceholder: 'Confirm password',
            preConfirm: async (password) => {
                try {
                    await actionDeleteOneSubSubProjectMutation.mutateAsync({ password, subSubProjectId: String(item?.subSubProjectId) })
                    AlertSuccessNotification({
                        text: 'Project deleted successfully',
                        className: 'info',
                        position: 'center',
                    })
                } catch (error: any) {
                    Swal.showValidationMessage(`${error?.response?.data?.message}`)
                    AlertDangerNotification({ text: `${error?.response?.data?.message}`, className: 'info', position: 'center' })
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        })

    }

    const calculatedContributors: number = Number(Number(dataContributorMini?.data.total) - Number(dataContributorMini?.data?.total_value))
    return (
        <>
            <tr key={item?.id}>
                <td>
                    <div className='d-flex align-items-center' onClick={() => navigate(`/projects/sb-sb-p/${item?.subSubProjectId}`, { replace: true })}>
                        <div className='symbol symbol-35px me-5'>
                            <img src={toAbsoluteUrl('/media/svg/files/folder-document.svg')} alt={item?.subSubProject?.name} />
                        </div>
                        <div className='d-flex justify-content-start flex-column'>
                            <Link to={`/projects/sb-sb-p/${item?.subSubProjectId}`} className='text-dark fw-bold text-hover-primary fs-6'>
                                {item?.subSubProject?.name}
                            </Link>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                {item?.subSubProject?.description}
                            </span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className='symbol-group symbol-hover flex-nowrap'>

                        {dataContributorMiniTable}

                        {calculatedContributors > 0 && (
                            <span className="symbol symbol-35px symbol-circle">
                                <span className="symbol-label fs-8 fw-bold bg-dark text-gray-300">
                                    +{calculatedContributors}
                                </span>
                            </span>
                        )}


                    </div>
                </td>

                <td>
                    {arrayAuthorized.includes(`${subProject?.role?.name}`) && (
                        <span className={`badge badge-light-${colorRole[String(item?.role?.name)]} fw-bolder`}>
                            {item?.role?.name}
                        </span>
                    )}
                </td>
                <td>
                    <span className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                        {formateDateDayjs(item?.createdAt as Date)}
                    </span>
                </td>
                <td>
                    {arrayAuthorized.includes(`${subProject?.role?.name}`) && (
                        <div className='d-flex justify-content-end flex-shrink-0'>
                            <button onClick={() => { setOpenModal(true) }} className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                                <KTSVG path='/media/icons/duotune/communication/com006.svg' className='svg-icon-3' />
                            </button>
                            <button onClick={() => { setOpenCreateOrUpdateModal(true) }} className='btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1'>
                                <KTSVG path='/media/icons/duotune/general/gen055.svg' className='svg-icon-3' />
                            </button>
                            <button type='button' onClick={() => { deleteItem(item) }} className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'>
                                <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                            </button>
                        </div>
                    )}
                </td>
            </tr>
            {openModal && (<InviteContributorFormModal setOpenModal={setOpenModal} subSubProjectId={item?.subSubProject?.id} />)}
            {openCreateOrUpdateModal && (<SubSubProjectCreateFormModal subSubProject={item?.subSubProject} setOpenCreateOrUpdateModal={setOpenCreateOrUpdateModal} />)}
        </>
    )
}

export default SubSubProjectList
