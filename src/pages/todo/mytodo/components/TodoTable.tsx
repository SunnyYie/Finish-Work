import { useState } from 'react'
import { Grid, Input, Button, Table, Tag } from '@arco-design/web-react'
import dayjs from 'dayjs'
import { patentLegalStatus, patentStatus } from '@/pages/case/patent/patent.enum'
import { status } from '@/pages/case/proposal/types/status,enum'
import { useHistory } from 'react-router-dom'

const { Row, Col } = Grid

export default function TodoTable(props: { type?: string; status?: string; todoData?: any }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState(['4'])
  const [inputValue, setInputValue] = useState('')
  const history = useHistory()

  const columns = [
    {
      title: '案件编号',
      dataIndex: '_id',
    },
    {
      title: '事项名称',
      dataIndex: 'title',
    },
    {
      title: '类型',
      dataIndex: 'patent_type',
      render: (col, record, _index) => {
        return <div>{record.patent_type ? record.patent_type : '无'}</div>
      },
    },
    {
      title: '法律状态',
      dataIndex: 'legal_status',
      key: 'legal_status',
      render: (col, record, _index) => {
        return <>{record.legal_status ? <Tag color="#ffb400">{patentLegalStatus[record.legal_status]}</Tag> : '无'}</>
      },
    },
    {
      title: '案件状态',
      dataIndex: 'status',
      key: 'status',
      render: (col, record, _index) => {
        return <>{record.legal_status ? <Tag color="#ffb400">{patentStatus[record.status]}</Tag> : <Tag color="#ffb400">{status[record.status]}</Tag>}</>
      },
    },
    {
      title: '发起时间',
      dataIndex: 'created',
      render: (col, record, _index) => dayjs(record.application_date).format('YYYY-MM-DD'),
    },
    {
      title: '截至时间',
      dataIndex: 'end',
      render: (col, record, _index) => (record.end ? dayjs(record.end).format('YYYY-MM-DD') : '暂未结束'),
    },
    {
      title: '操作',
      render: (col, record, _index) => (
        <Button
          type="text"
          onClick={() => {
            if (record.legal_status) {
              history.push('/case/patent')
            } else {
              history.push('/case/proposal')
            }
          }}
          style={{ padding: 0 }}
        >
          查看
        </Button>
      ),
    },
  ]

  return (
    <>
      <Row>
        <Col span={8}>
          <Input.Search
            searchButton
            placeholder="案件编号或专利名称"
            style={{ width: 350 }}
            value={inputValue}
            onChange={(value) => {
              // todo:调用接口
              setInputValue(value)
            }}
          />
        </Col>

        <Col span={10}></Col>
      </Row>

      <Table
        rowKey="_id"
        style={{ marginTop: 20 }}
        data={props.todoData}
        columns={columns as any}
        onChange={(pagination, changedSorter) => {
          console.log(changedSorter, pagination)
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log('onChange:', selectedRowKeys, selectedRows)
            setSelectedRowKeys(selectedRowKeys as any)
          },
          onSelect: (selected, record, selectedRows) => {
            console.log('onSelect:', selected, record, selectedRows)
          },
        }}
      />
    </>
  )
}
