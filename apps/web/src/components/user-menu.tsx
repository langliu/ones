import { Link, useNavigate } from '@tanstack/react-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'

import { Button, buttonVariants } from './ui/button'
import { Skeleton } from './ui/skeleton'

export default function UserMenu() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <Skeleton className='h-9 w-24' />
  }

  if (!session) {
    return (
      <Link className={buttonVariants({ variant: 'outline' })} to='/login'>
        登录
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-card'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>我的账户</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: '/',
                    })
                  },
                },
              })
            }}
            variant='destructive'
          >
            退出登录
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
