import { Form, Input, Link, Button, Space } from '@arco-design/web-react'
import { FormInstance } from '@arco-design/web-react/es/Form'
import { IconLock, IconUser } from '@arco-design/web-react/icon'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import useLocale from '@/utils/useLocale'
import locale from './locale'
import styles from './style/index.module.less'
import useStorage from '@/utils/useStorage'

export default function LoginForm() {
  const formRef = useRef<FormInstance>()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useStorage('user_info')

  const t = useLocale(locale)

  function afterLoginSuccess() {
    // 记录登录状态
    localStorage.setItem('userStatus', 'login')
    // 跳转首页
    window.location.href = '/'
  }

  function login(params) {
    setErrorMessage('')
    setLoading(true)

    axios
      .post('/api/user/login', params)
      .then((res) => {
        const { status, data } = res
        setValue(JSON.stringify(data.data))

        if (status === 201) {
          afterLoginSuccess()
        } else {
          setErrorMessage(data.msg || t['login.form.login.errMsg'])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function onSubmitClick() {
    login(formRef.current.getFieldsValue())
  }

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{'登录知识产权管理系统'}</div>
      <div className={styles['login-form-sub-title']}>{'登录知识产权管理系统'}</div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item field="phone" rules={[{ required: true, message: '请输入正确的手机号' }]}>
          <Input prefix={<IconUser />} placeholder={t['login.form.userName.placeholder']} onPressEnter={onSubmitClick} />
        </Form.Item>
        <Form.Item field="code" rules={[{ required: true }]}>
          <Input.Password prefix={<IconLock />} placeholder={t['login.form.password.placeholder']} onPressEnter={onSubmitClick} />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Link>{t['login.form.forgetPassword']}</Link>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t['login.form.login']}
          </Button>
          <Button type="text" long className={styles['login-form-register-btn']}>
            {t['login.form.register']}
          </Button>
        </Space>
      </Form>
    </div>
  )
}
