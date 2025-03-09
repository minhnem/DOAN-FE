import { Button, Form, Input, message, Space, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/image/logo-doan.png'
import { appInfo } from '../../constants/appInfos'
import { colors } from '../../constants/colors'
import handleAPI from '../../api/handleAPI'
import { useDispatch } from 'react-redux'
import { addAuth } from '../../redux/reducers/authReducer'

const Login = () => {

  const dispatch = useDispatch()

  const [form] = useForm()

  const handleLogin = async (values: any) => {
    const data: any = {}
    for(const i in values) {
      data[i] = values[i] ?? ''
    }try {
      const api = '/auth/login'
      const res: any = await handleAPI(api, data, 'post')
      if(res.data) {
        message.success(res.message)
        dispatch(addAuth(res.data))
        localStorage.setItem('auth', JSON.stringify(res.data))
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    }
  }

  return (
    <div className='min-h-[100vh] grid grid-rows-1 grid-cols-2'>
      <div style={{
        backgroundImage: `url('https://res.cloudinary.com/dncscl67q/image/upload/v1733130615/cld-sample-4.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className='flex justify-start items-center gap-2 p-4'>
          <img src={logo} alt='logo'/>
          <Typography.Title level={2} style={{ margin: '0', padding: '0', lineHeight: '0', color: colors.primary }}>{appInfo.title}</Typography.Title>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='w-1/2'>
          <div className='flex justify-center items-center gap-2 mb-8'>
            <img className='w-11 h-11' src={logo} alt='logo'/>
            <Typography.Title level={3} style={{ margin: '0', padding: '0', lineHeight: '0', color: colors.primary }}>{appInfo.title}</Typography.Title>
          </div>
          <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '800' }}>Đăng nhập</Typography.Title>
          <p className='text-center text-[1.2rem] font-medium mb-4'>Chào mừng bạn, hãy đăng nhập tài khoản để có thông báo về những chương trình ưu đãi của chúng tôi.</p>
          <Form
            form={form}
            layout='vertical'
            size='large'
            onFinish={handleLogin}
          >
            <Form.Item name='email' label='Nhập email:' rules={[{ type: 'email', message: 'Email không hợp lệ!!' }, { required: true, message: 'Bạn chưa nhập email!!' }]}>
              <Input className='h-12' placeholder='Nhập email' allowClear />
            </Form.Item>
            <Form.Item name='password' label='Nhập mật khẩu:' rules={[{ required: true, message: 'Bạn chưa nhập mật khẩu!!' }]}>
              <Input.Password className='h-12' placeholder='Nhập mật khẩu' allowClear />
            </Form.Item>
          </Form>

          <div className='text-right'>
            <Link to={'/'} style={{ fontWeight: '600', color: '#1677FF'}}>Bạn quyên mật khẩu?</Link>
          </div>
          <Button
            className='w-full mt-8 py-6'
            type='primary'
            size='large'
            onClick={() => {
              form.submit()
            }}
          >
            Đăng nhập
          </Button>

          <div className='text-center mt-14'>
            <Space>
              <Typography.Text style={{ fontWeight: '600' }}>Bạn đã có tài khoản chưa? </Typography.Text>
              <Link to={'/register'} style={{ fontWeight: '600', color: '#1677FF' }}>Đăng ký</Link>
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
