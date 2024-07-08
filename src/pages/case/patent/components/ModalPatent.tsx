import { Modal, Form, Input, Select, DatePicker, Upload } from '@arco-design/web-react'
import { UploadItem } from '@arco-design/web-react/es/Upload'
import axios from 'axios'
import { useState } from 'react'

const Option = Select.Option

function ModalPatent(props) {
  const { visible, setVisible, userId, setUpdated, formRef, buttonStatus } = props

  const [currentFile, setCurrentFile] = useState<File>()
  const [fileList, setFileList] = useState<UploadItem[]>([])

  const handleFileChange = (fileList: UploadItem[], file: UploadItem) => {
    const originFile = file.originFile
    setCurrentFile(originFile)
    setFileList(fileList)
  }

  const handleSubmit = () => {
    formRef.current.validate().then((values) => {
      let body

      if (currentFile) {
        const formData = new FormData()
        formData.append('file', currentFile)

        axios.post(`/api/patent/upload?id=${values.title}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      body = Object.assign(values, { user_id: userId, finished: false })

      if (buttonStatus === 'create') {
        body = Object.assign(values, { payment: Math.random() * 1000 })

        axios.post('/api/patent', body).finally(() => {
          setVisible(false)
          setUpdated((prev) => !prev)

          formRef.current.resetFields()
          setCurrentFile(null)
          setFileList([])
        })
      } else if (buttonStatus === 'update') {
        axios.put('/api/patent', body).finally(() => {
          setVisible(false)
          setUpdated((prev) => !prev)
        })
      }
    })
  }

  return (
    <div>
      <Modal title={buttonStatus === 'create' ? '新增专利' : '修改专利'} visible={visible} onOk={handleSubmit} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true} style={{ width: '600px' }}>
        <Form ref={formRef}>
          {buttonStatus === 'update' && (
            <>
              <Form.Item label="提案id" field="patent_id">
                <Input type="text" disabled />
              </Form.Item>
              <Form.Item label="id" field="_id">
                <Input.Password type="text" disabled visibility={false} />
              </Form.Item>
              <Form.Item label="提案状态" field="status">
                <Select placeholder="Please select" style={{ width: 154 }}>
                  {[
                    { key: 'substantive_examination', value: '待审查' },
                  ].map((option, index) => (
                    <Option key={option.key} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          <Form.Item label="专利名称" field="title" rules={[{ required: true, message: '请填写案件编号' }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="专利类型" field="patent_type" rules={[{ required: true, message: '请填写案件编号' }]}>
            <Select>
              {['发明专利', '实用新型', '外观设计'].map((option, index) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="申请日" field="application_date" rules={[{ required: true, message: '请填写案件编号' }]}>
            <DatePicker style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="申请人" field="applicant" rules={[{ required: true, message: '请填写案件编号' }]}>
            <Input type="text" />
          </Form.Item>

          <Form.Item label="相关技术">
            <Upload onChange={handleFileChange} limit={1} accept={'.xlsx'} fileList={fileList}></Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalPatent
