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

export default function SignInForm() {
  const navigate = useNavigate({
    from: '/',
  })
  const { isPending } = authClient.useSession()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
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
            toast.success('Sign in successful')
          },
        },
      )
    },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email address'),
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
          <CardTitle className='text-2xl'>欢迎回来</CardTitle>
          <CardDescription>在下方输入您的邮箱以登录您的账户</CardDescription>
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
                    <div className='flex items-center'>
                      <Label htmlFor={field.name}>密码</Label>
                      <Link className='ml-auto inline-block text-sm underline' to='/login'>
                        忘记密码？
                      </Link>
                    </div>
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
                  {state.isSubmitting ? '登录中...' : '登录'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <div className='text-center text-sm'>
            还没有账户？{' '}
            <Link className='underline' to='/register'>
              注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
