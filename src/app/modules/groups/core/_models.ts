import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {createOneGroup, getOneGroup, updateOneGroup} from './_requests'
import {ContributorRoleModel} from '../../contributors/core/_models'
import {ProjectRequestModel} from '../../projects/core/_models'

export type GroupModel = {
  id: string
  createdAt: Date
  slug: string
  name: string
  color: string
  image: string
  organizationId: string
  contributorTotal: number
  description: string
  postTotal: number
  organization: {
    id: string
    name: string
    color: string
    userId: string
  }
  role: {name: ContributorRoleModel}
}

export const CreateOrUpdateOneGroupMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: any) => void
} = {}) => {
  const queryKey = ['groups']
  const queryClient = useQueryClient()
  const result = useMutation(
    async (payload: ProjectRequestModel): Promise<any> => {
      const {
        groupId,
        name,
        description,
        projectId,
        subProjectId,
        subSubProjectId,
        subSubSubProjectId,
      } = payload
      const {data} = groupId
        ? await updateOneGroup({groupId, name, description})
        : await createOneGroup({
            name,
            description,
            projectId,
            subProjectId,
            subSubProjectId,
            subSubSubProjectId,
          })
      return data
    },
    {
      onSettled: async () => {
        await queryClient.invalidateQueries({queryKey})
        if (onSuccess) {
          onSuccess()
        }
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey})
        if (onSuccess) {
          onSuccess()
        }
      },
      onError: async (error: any) => {
        await queryClient.invalidateQueries({queryKey})
        if (onError) {
          onError(error)
        }
      },
    }
  )

  return result
}
