import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { orpc } from '@/utils/orpc'

const clientsSearchSchema = z.object({
  limit: z.coerce.number().min(1).optional().default(10),
  page: z.coerce.number().min(1).optional().default(1),
})

export const Route = createFileRoute('/dashboard/clients')({
  component: ClientsPage,
  validateSearch: (search) => clientsSearchSchema.parse(search),
})

function ClientsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const { data, isLoading } = useQuery(
    orpc.user.list.queryOptions({
      input: {
        limit: search.limit,
        page: search.page,
      },
    }),
  )

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page }),
    })
  }

  if (isLoading) {
    return <div className='p-8'>Loading...</div>
  }

  const { data: users, pagination } = data || { data: [], pagination: { totalPages: 0 } }

  return (
    <div className='flex flex-col gap-4 p-8'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-3xl tracking-tight'>客户</h2>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱📮</TableHead>
              <TableHead>是否验证</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell className='h-24 text-center' colSpan={4}>
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className='cursor-pointer'
                onClick={() => (search.page > 1 ? handlePageChange(search.page - 1) : undefined)}
              />
            </PaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className='cursor-pointer'
                  isActive={page === search.page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className='cursor-pointer'
                onClick={() =>
                  search.page < pagination.totalPages
                    ? handlePageChange(search.page + 1)
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
