import React, { useEffect, useState, useRef } from 'react'
import { Table, Input, Space, Button, Card, Tag, FormInstance, Message, Modal, Spin } from '@arco-design/web-react'
import { useHistory } from 'react-router-dom'
import ModalProposalCreate from './create'
import useStorage from '@/utils/useStorage'
import dayjs from 'dayjs'
import axios from 'axios'
import { status } from '../types/status,enum'

const SearchTable = () => {
  const history = useHistory()
  const [selectedRowKeys, setSelectedRowKeys] = useState(['4'])

  const [visible, setVisible] = useState(false)
  const [reasonVisible, setReasonVisible] = useState(false)
  const [selectId, setSelectId] = useState('')
  const [reasonTextValue, setReasonTextValue] = useState('')
  const [value] = useStorage('user_info')

  const [dataSource, setDataSource] = useState()
  const [count, setCount] = useState(0)
  const [updated, setUpdated] = useState(false)

  const [buttonStatus, setButtonStatus] = useState('create')
  const [loading, setLoading] = useState(false)

  const formRef = useRef<FormInstance>()

  const columns = [
    {
      title: '序号',
      render: (col, record, index) => index + 1,
    },
    {
      title: '案件编号',
      dataIndex: 'proposal_id',
      key: 'proposal_id',
    },
    {
      title: '提案名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      render: (col, record, _index) => dayjs(record.createDate).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      render: (col, record, _index) => (record.updateDate ? dayjs(record.updateDate).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '提案状态',
      dataIndex: 'status',
      key: 'status',
      render: (col, record, _index) => {
        return <Tag color="#ffb400">{status[record.status]}</Tag>
      },
    },
    {
      title: '操作',
      width: 200,
      render: (col, record, _index) => {
        return (
          <Space>
            {JSON.parse(value).role === 'student' ? (
              <>
                <Button
                  style={{ padding: 0 }}
                  type="text"
                  onClick={() => {
                    handleUpdateModal(record)
                  }}
                >
                  编辑
                </Button>
                <Button
                  style={{ padding: 0 }}
                  type="text"
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
                    history.push(`/case/proposal_detail/${record._id}`)
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
                    history.push(`/case/proposal_detail/${record._id}`)
                  }}
                >
                  详情
                </Button>
                <Button
                  type="text"
                  style={{ padding: 0 }}
                  onClick={() => {
                    axios.put('/api/proposal', { _id: record._id, status: 'approved', finished: true })
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

    const res = JSON.parse(value).role === 'student' ? await axios.get(`/api/proposal/${JSON.parse(value)._id}`) : await axios.get(`/api/proposal`, { params: { status: 'supplementary_material' + ' ' + 'submitted' } })
    setDataSource(res.data.data)
    setCount(res.data.count)
    setLoading(false)
  }

  const handleUpdateModal = (res) => {
    formRef.current.setFieldsValue({
      proposal_id: res.proposal_id,
      title: res.title,
      _id: res._id,
      status: status[res.status],
    })

    setVisible(true)
    setButtonStatus('update')
  }

  const handleUploadXlsx = () => {
    fetch('/api/proposal/download')
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.setAttribute('download', 'template.xlsx')
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
      .catch((error) => {
        console.error('Error downloading the file:', error)
      })
  }

  const handleDelete = (id) => {
    axios.delete(`/api/proposal/${id}`).finally(() => {
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
        {JSON.parse(value).role === 'student' && (
          <Button
            type="primary"
            onClick={() => {
              setVisible(true)
              setButtonStatus('create')

              formRef.current.resetFields()
            }}
          >
            新建提案
          </Button>
        )}
      </Space>
      <Card style={{ marginTop: 20, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>共计{count}条数据</p>
          <Space>
            {JSON.parse(value).role === 'student' && (
              <>
                <Button>删除</Button>
                <Button onClick={handleUploadXlsx}>下载模板</Button>
              </>
            )}
          </Space>
        </div>
        <Spin block loading={loading}>
          <Table
            rowKey={'proposal_id'}
            style={{ marginTop: 20 }}
            data={dataSource}
            columns={columns}
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

      <ModalProposalCreate visible={visible} setVisible={setVisible} userId={JSON.parse(value)._id} setUpdated={setUpdated} formRef={formRef} buttonStatus={buttonStatus} />
      {/* <ModalImportDoc visible={importVisible} setVisible={setImportVisible} /> */}

      <Modal
        title="Modal Title"
        visible={reasonVisible}
        onOk={() => {
          axios.put('/api/proposal', { _id: selectId, status: 'rejection', reason: reasonTextValue, finished: true }).then(() => {
            setReasonVisible(false)
            setUpdated(true)
          })
        }}
        onCancel={() => setReasonVisible(false)}
      >
        <Input.TextArea placeholder="请填写不通过原因" value={reasonTextValue} onChange={setReasonTextValue} />
      </Modal>
    </>
  )
}

export default SearchTable
