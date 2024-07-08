import createUUID from '@/utils/createUUID'
import { Button, Grid, Input, Table, TableColumnProps } from '@arco-design/web-react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Row = Grid.Row
const Col = Grid.Col

export default function PatentDocument(props) {
  const { tableData } = props
  const [currentList, setCurrentList] = useState([])

  const columns: TableColumnProps[] = [
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '文件编号',
      dataIndex: 'doc_id',
      render(col, item, index) {
        return 'WD' + createUUID()
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      render(col, item, index) {
        return dayjs(tableData[0].application_date).format('YYYY-MM-DD')
      },
    },
    {
      title: '过期时间',
      dataIndex: 'end_at',
      render(col, item, index) {
        return dayjs().format('YYYY-MM-DD')
      },
    },
    {
      title: '操作',
      render: (col, record, index) => {
        return (
          <>
            <Button
              type="text"
              style={{ padding: 2 }}
              onClick={() => {
                handleUploadXlsx(tableData[0].title, record.name)
              }}
            >
              下载
            </Button>
            <Button type="text" style={{ padding: 0 }}>
              删除
            </Button>
          </>
        )
      },
    },
  ]

  const handleUploadXlsx = (title, fileName) => {
    const params = new URLSearchParams()
    params.append('title', title)
    params.append('fileName', fileName)

    fetch(`/api/patent/download?${params.toString()}`)
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
      .catch((error) => {
        console.error('Error downloading the file:', error)
      })
  }

  useEffect(() => {
    const getFileList = async () => {
      const res = await axios.post(`/api/patent/fileContent`, {
        title: tableData[0].title,
      })

      if (res.data.data) {
        const currentData = res.data.data.map((item) => {
          if (item.file.length === 0) {
            return {
              ...{
                专利类型: '暂无',
                申请国家: '暂无',
              },
              name: item.fileName,
              updated: dayjs(tableData[0].updated).format('YYYY-MM-DD HH:mm:ss'),
            }
          }

          const obj = Object.fromEntries(item.file[0].map((key, index) => [key, item.file[1][index]]))

          return {
            ...obj,
            name: item.fileName,
            updated: dayjs(tableData[0].updated).format('YYYY-MM-DD HH:mm:ss'),
          }
        })

        setCurrentList(currentData)
      }
    }

    getFileList()
  }, [])

  return (
    <>
      <Row className="grid-demo">
        <Col span={16} push={8}></Col>
        <Col span={8} pull={16}>
          <Input.Search style={{ marginBottom: 20 }} placeholder="请输入文件名称关键字" />
        </Col>
      </Row>
      <Table columns={columns} data={currentList} rowKey={'name'} />
    </>
  )
}
