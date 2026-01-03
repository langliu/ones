import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
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
import { useDebounce } from '@/hooks/use-debounce'

import { orpc } from '@/utils/orpc'

const clientsSearchSchema = z.object({
  limit: z.coerce.number().min(1).optional().default(10),
  name: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
})

export const Route = createFileRoute('/dashboard/clients')({
  component: ClientsPage,
  validateSearch: (search) => clientsSearchSchema.parse(search),
})

function ClientsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [searchTerm, setSearchTerm] = useState(search.name || '')
  const debouncedSearch = useDebounce(searchTerm, 500)

  // Sync internal state with URL search param
  useEffect(() => {
    setSearchTerm(search.name || '')
  }, [search.name])

  // Trigger navigation when debounced search term changes
  useEffect(() => {
    if (debouncedSearch !== (search.name || '')) {
      navigate({
        search: (prev) => ({ ...prev, name: debouncedSearch || undefined, page: 1 }),
      })
    }
  }, [debouncedSearch, navigate, search.name])

  const { data, isLoading } = useQuery(
    orpc.user.list.queryOptions({
      input: {
        limit: search.limit,
        name: search.name,
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
        <div className='flex items-center gap-2'>
          <Input
            className='h-8 w-[150px] lg:w-[250px]'
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='搜索客户...'
            value={searchTerm}
          />
        </div>
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
