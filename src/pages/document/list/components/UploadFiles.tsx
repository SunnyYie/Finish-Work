import { Upload } from '@arco-design/web-react'

export default function UploadFiles(props) {
  const { value, onChange } = props

  return (
    <Upload
      limit={1}
      onChange={(fileList) => {
        if (fileList && fileList.length !== 0) {
          onChange(fileList[0])
        }
      }}
    />
  )
}
