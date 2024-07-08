import { Button, Card, FormInstance, Input, Space, Spin, Table, Tag } from '@arco-design/web-react'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useStorage from '@/utils/useStorage'
import ModalPatent from './ModalPatent'
import dayjs from 'dayjs'
import axios from 'axios'
import { patentPaymentStatus } from '../patent.enum'

const PatentTable = () => {
  const history = useHistory()
  const [selectedRowKeys, setSelectedRowKeys] = useState(['4'])

  const [value] = useStorage('user_info')

  const [dataSource, setDataSource] = useState()
  const [count, setCount] = useState(0)
  const [updated, setUpdated] = useState(false)

  const [paymentLoading, setPaymentLoading] = useState(false)

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
      title: '费用类型',
      dataIndex: 'costType',
      key: 'costType',
      render: (col, record, _index) => '官费',
    },
    {
      title: '费用明细',
      dataIndex: 'costDetails',
      key: 'costDetails',
      render: (col, record, _index) => '',
    },
    {
      title: '缴费截止日期',
      dataIndex: 'application_date',
      key: 'application_date',
      render: (col, record, _index) => '2025-06-01',
    },
    {
      title: '实际缴费日期',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (col, record, _index) => (record.payment_date ? dayjs(record.payment_date).format('YYYY-MM-DD') : ''),
    },
    {
      title: '金额',
      dataIndex: 'payment',
      key: 'payment',
      render: (col, record, _index) => (record.payment ? Math.round(record.payment) : ''),
    },
    {
      title: '官方缴纳状态',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (col, record, _index) => {
        return <Tag color="#ffb400">{patentPaymentStatus[record.payment_status]}</Tag>
      },
    },
    {
      title: '操作',
      render: (col, record, _index) => {
        return (
          <Space>
            {record.payment_status === 'unpaid' ? (
              <Button
                type="text"
                style={{ padding: 0 }}
                onClick={() => {
                  axios.put('/api/patent', { _id: record._id, payment_status: 'paid', payment_date: Date.now() }).finally(() => {
                    setUpdated((prev) => !prev)
                  })
                }}
              >
                缴费
              </Button>
            ) : (
              <Button
                type="text"
                style={{ padding: 0 }}
                onClick={() => {
                  history.push(`/case/detail/${record._id}`)
                }}
              >
                详情
              </Button>
            )}
          </Space>
        )
      },
    },
  ]

  const getProposalList = async () => {
    setPaymentLoading(true)

    axios
      .get(`/api/patent/${JSON.parse(value)._id}`)
      .then((res) => {
        setDataSource(res.data.data)
        setCount(res.data.count)
      })
      .finally(() => {
        setPaymentLoading(false)
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
          </Space>
        </div>
        <Spin block loading={paymentLoading}>
          <Table
            rowKey={'_id'}
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
      </Card>
    </>
  )
}

export default PatentTable
