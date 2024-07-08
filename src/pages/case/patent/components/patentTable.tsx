import { Button, Card, FormInstance, Input, Message, Modal, Space, Spin, Table, Tag } from '@arco-design/web-react'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useStorage from '@/utils/useStorage'
import ModalPatent from './ModalPatent'
import dayjs from 'dayjs'
import axios from 'axios'
import { patentLegalStatus, patentStatus } from '../patent.enum'

const PatentTable = () => {
  const history = useHistory()
  const [selectedRowKeys, setSelectedRowKeys] = useState(['4'])

  const [visible, setVisible] = useState(false)
  const [reasonVisible, setReasonVisible] = useState(false)
  const [selectId, setSelectId] = useState('')
  const [reasonTextValue, setReasonTextValue] = useState('')
  const [value] = useStorage('user_info')

  const formRef = useRef<FormInstance>()
  const [dataSource, setDataSource] = useState()
  const [count, setCount] = useState(0)
  const [updated, setUpdated] = useState(false)

  const [buttonStatus, setButtonStatus] = useState('create')
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      title: '申请号',
      dataIndex: 'patent_id',
      key: 'patent_id',
    },
    {
      title: '专利名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '申请日',
      dataIndex: 'application_date',
      key: 'application_date',
      render: (col, record, _index) => dayjs(record.application_date).format('YYYY-MM-DD'),
    },
    {
      title: '案件编号',
      dataIndex: 'document_id',
      key: 'document_id',
    },
    {
      title: '专利类型',
      dataIndex: 'patent_type',
      key: 'patent_type',
    },
    {
      title: '法律状态',
      dataIndex: 'legal_status',
      key: 'legal_status',
      render: (col, record, _index) => {
        return <Tag color="#ffb400">{patentLegalStatus[record.legal_status]}</Tag>
      },
    },
    {
      title: '案件状态',
      dataIndex: 'status',
      key: 'status',
      render: (col, record, _index) => {
        return <Tag color="#ffb400">{patentStatus[record.status]}</Tag>
      },
    },
    {
      title: '操作',
      render: (col, record, _index) => {
        return (
          <Space>
            {JSON.parse(value).role === 'student' ? (
              <>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    setVisible(true)
                    setButtonStatus('update')
                    handleUpdateModal(record)
                  }}
                >
                  编辑
                </Button>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    handleDelete(record._id)
                  }}
                >
                  删除
                </Button>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    history.push(`/case/detail/${record._id}`)
                  }}
                >
                  详情
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    history.push(`/case/detail/${record._id}`)
                  }}
                >
                  详情
                </Button>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    axios.put('/api/patent', { _id: record._id, status: 'authorization', finished: true })
                    setUpdated(true)
                  }}
                >
                  通过
                </Button>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    setSelectId(record._id)
                    setReasonVisible(true)
                  }}
                >
                  不通过
                </Button>
              </>
            )}
          </Space>
        )
      },
    },
  ]

  const getProposalList = async () => {
    setLoading(true)

    const res = JSON.parse(value).role === 'student' ? await axios.get(`/api/patent/${JSON.parse(value)._id}`) : await axios.get(`/api/patent`, { params: { status: 'substantive_examination' } })
    setDataSource(res.data.data)
    setCount(res.data.count)
    setLoading(false)
  }

  const handleUpdateModal = (res) => {
    formRef.current.setFieldsValue({ ...res, status: patentStatus[res.status] })
  }

  const handleDelete = (id) => {
    axios.delete(`/api/patent/${id}`).finally(() => {
      Message.success('删除成功')

      setUpdated((prev) => !prev)
    })
  }

  useEffect(() => {
    getProposalList()
  }, [])

  useEffect(() => {
    getProposalList()
  }, [updated])

  return (
    <>
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search searchButton placeholder="输入提案名称关键字" status="warning" style={{ width: 450 }} />
      </Space>
      <Card style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>共计{count}条数据</p>
          <Space>
            <Button>删除</Button>
            <Button
              onClick={() => {
                setVisible(true)
                setButtonStatus('create')

                formRef.current.resetFields()
              }}
            >
              添加专利
            </Button>
          </Space>
        </div>
        <Spin block loading={loading}>
          <Table
            rowKey={'patent_id'}
            data={dataSource}
            style={{ marginTop: 20 }}
            columns={columns}
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
        </Spin>
        <ModalPatent visible={visible} setVisible={setVisible} userId={JSON.parse(value)._id} setUpdated={setUpdated} formRef={formRef} buttonStatus={buttonStatus} />

        <Modal
          title="Modal Title"
          visible={reasonVisible}
          onOk={() => {
            axios.put('/api/patent', { _id: selectId, status: 'rejection', reason: reasonTextValue, finished: true }).then(() => {
              setReasonVisible(false)
              setUpdated(true)
            })
          }}
          onCancel={() => setReasonVisible(false)}
        >
          <Input.TextArea placeholder="请填写不通过原因" value={reasonTextValue} onChange={setReasonTextValue} />
        </Modal>
      </Card>
    </>
  )
}

export default PatentTable
