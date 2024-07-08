import React from 'react'
import { Modal, Upload } from '@arco-design/web-react'
import { UploadProps } from '@arco-design/web-react/es/Upload/interface'

export default function ModalImportDoc(props) {
  const { visible, setVisible } = props

  const uploadProps: UploadProps = {
    accept: '.xls',
    beforeUpload: (file) => {
      // Add your logic here to handle the file before uploading
      return true // Return true to allow uploading the file
    },
    onChange: (info) => {
      // Add your logic here to handle the file change event
    },
  }

  return (
    <Modal title="Modal Title" visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} autoFocus={false} focusLock={true}>
      <Upload {...uploadProps}></Upload>
    </Modal>
  )
}
