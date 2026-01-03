import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

import { authClient } from '@/lib/auth-client'

import Loader from './loader'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignUpForm() {
  const navigate = useNavigate({
    from: '/',
  })
  const { isPending } = authClient.useSession()

  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.name,
          password: value.password,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText)
          },
          onSuccess: () => {
            navigate({
              to: '/dashboard',
            })
            toast.success('Sign up successful')
          },
        },
      )
    },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email address'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  })

  if (isPending) {
    return <Loader />
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>创建账户</CardTitle>
          <CardDescription>输入您的信息以创建账户</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-4'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div>
              <form.Field name='name'>
                {(field) => (
                  <div className='space-y-2'>
                    <Label htmlFor={field.name}>姓名</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='Max'
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className='text-red-500 text-sm' key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name='email'>
                {(field) => (
                  <div className='space-y-2'>
                    <Label htmlFor={field.name}>邮箱</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='m@example.com'
                      type='email'
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className='text-red-500 text-sm' key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name='password'>
                {(field) => (
                  <div className='space-y-2'>
                    <Label htmlFor={field.name}>密码</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='********'
                      type='password'
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p className='text-red-500 text-sm' key={error?.message}>
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Subscribe>
              {(state) => (
                <Button
                  className='w-full'
                  disabled={!state.canSubmit || state.isSubmitting}
                  type='submit'
                >
                  {state.isSubmitting ? '创建账户中...' : '注册'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <div className='text-center text-sm'>
            已有账户？{' '}
            <Link className='underline' to='/login'>
              登录
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
