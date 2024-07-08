import { Modal, Form, Input, Upload, Select } from '@arco-design/web-react'
import { UploadItem } from '@arco-design/web-react/es/Upload'
import axios from 'axios'
import { useState } from 'react'

const Option = Select.Option

function ModalProposalCreate(props) {
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

        axios.post(`/api/proposal/upload?id=${values.title}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        body = Object.assign(values, { user_id: userId, technologyDisclosure: true, finished: false, createData: Date.now() })
      } else {
        body = Object.assign(values, { user_id: userId, technologyDisclosure: false, finished: false })
      }

      if (buttonStatus === 'create') {
        body = Object.assign(values, { createDate: Date.now() })
        axios.post('/api/proposal', body).finally(() => {
          setVisible(false)
          setUpdated((prev) => !prev)

          formRef.current.resetFields()
          setCurrentFile(null)
          setFileList([])
        })
      } else if (buttonStatus === 'update') {
        body = Object.assign(values, { updateDate: Date.now() })

        axios.put('/api/proposal', body).finally(() => {
          setVisible(false)
          setUpdated((prev) => !prev)
        })
      }
    })
  }

  return (
    <div>
      <Modal title="Modal Title" visible={visible} onOk={handleSubmit} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true} style={{ width: '600px' }}>
        <Form ref={formRef}>
          {buttonStatus === 'update' && (
            <>
              <Form.Item label="提案id" field="proposal_id">
                <Input type="text" disabled />
              </Form.Item>
              <Form.Item label="id" field="_id">
                <Input.Password type="text" disabled visibility={false} />
              </Form.Item>
              <Form.Item label="提案状态" field="status">
                <Select placeholder="Please select" style={{ width: 154 }}>
                  {[
                    { key: 'supplementary_material', value: '待补充材料' },
                    { key: 'submitted', value: '已提交申请' },
                  ].map((option, index) => (
                    <Option key={option.key} value={option.key}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item label="提案名称" field="title" rules={[{ required: true, message: '请填写案件编号' }]}>
            <Input type="text" />
          </Form.Item>

          <Form.Item label="上传技术材料">
            <Upload onChange={handleFileChange} limit={1} accept={'.xlsx'} fileList={fileList}></Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalProposalCreate
