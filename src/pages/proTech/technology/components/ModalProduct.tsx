import useStorage from '@/utils/useStorage'
import { DatePicker, Form, Input, Modal } from '@arco-design/web-react'
import axios from 'axios'

export default function ModalProduct(props) {
  const { visible, setVisible, formRef, setUpdated, buttonStatus } = props
  const [value] = useStorage('user_info')

  const handleCreateProduct = () => {
    if (formRef && formRef.current) {
      formRef.current.validate().then((values) => {
        const body = Object.assign({}, values, { user_id: JSON.parse(value)._id })

        if (buttonStatus === 'create') {
          axios.post('/api/technology', body).finally(() => {
            setVisible(false)
            setUpdated((prev) => !prev)

            formRef.current.resetFields()
          })
        } else if (buttonStatus === 'update') {
          axios.put('/api/technology', body).finally(() => {
            setVisible(false)
            setUpdated((prev) => !prev)
          })
        }
      })
    }
  }

  return (
    <Modal title="Modal Title" visible={visible} onOk={handleCreateProduct} onCancel={() => setVisible(false)} autoFocus={false}>
      <Form autoComplete="off" ref={formRef}>
        {buttonStatus === 'update' && (
          <>
            <Form.Item label="技术id" field="document_id">
              <Input type="text" disabled />
            </Form.Item>
            <Form.Item label="id" field="_id">
              <Input.Password type="text" disabled visibility={false} />
            </Form.Item>
          </>
        )}
        <Form.Item label="技术名称" field="title" rules={[{ required: true }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="技术日期" field="application_date" rules={[{ required: true }]}>
          <DatePicker style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="技术编号" field="document_id" rules={[{ required: true }]}>
          <Input placeholder="请输入产品编号" />
        </Form.Item>
        <Form.Item label="技术描述" field="description">
          <Input placeholder="请输入产品描述" />
        </Form.Item>
        <Form.Item label="技术备注" field="remark">
          <Input placeholder="请输入产品备注" />
        </Form.Item>
        <Form.Item label="ipc分类号" field="ipc_id" rules={[{ required: true }]}>
          <Input placeholder="请输入ipc分类号" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
