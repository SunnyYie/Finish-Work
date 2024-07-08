import { Button, Descriptions, Modal, Table, TableColumnProps } from '@arco-design/web-react'
import dayjs from 'dayjs'
import { patentLegalStatus } from '../../patent/patent.enum'
import { useState } from 'react'

export default function TodoTable(props) {
  const { data, status } = props

  const [visible, setVisible] = useState(false)

  const columns: TableColumnProps[] = [
    {
      title: '事项名称',
      dataIndex: 'title',
    },
    {
      title: '事项状态',
      dataIndex: 'legal_status',
      render(col, item, index) {
        return patentLegalStatus[item.legal_status]
      },
    },
    {
      title: '发起时间',
      dataIndex: 'application_date',
      render: (col, record) => {
        return dayjs(record?.application_date).format('YYYY-MM-DD')
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_at',
      render: (col, record) => {
        return record?.end_at ? dayjs(record?.end_at).format('YYYY-MM-DD') : '暂未结束'
      },
    },
    {
      title: '操作',
      render: (col, record) => {
        return status ? (
          <Button
            onClick={() => {
              setVisible(true)
            }}
          >
            查看详情
          </Button>
        ) : null
      },
    },
  ]

  return (
    <>
      <Table columns={columns} data={data} rowKey={'name'} />

      <Modal
        title="事项详情"
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={() => {
          setVisible(false)
        }}
      >
        <Descriptions
          column={1}
          title="User Info"
          data={[
            {
              label: 'Name',
              value: 'Socrates',
            },
          ]}
          style={{ marginBottom: 20 }}
          labelStyle={{ paddingRight: 36 }}
        />
      </Modal>
    </>
  )
}
