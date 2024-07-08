import { Button, Descriptions, Divider, Message, Spin, Table, Tabs, Tag } from '@arco-design/web-react'
import dayjs from 'dayjs'
import { useState } from 'react'
import DrawerProduct from './DrawerProduct'
import { patentLegalStatus, patentStatus } from '@/pages/case/patent/patent.enum'
import axios from 'axios'
import { status } from '@/pages/case/proposal/types/status,enum'

const TabPane = Tabs.TabPane

const Content = (props) => {
  const [visible, setVisible] = useState(false)

  const patentColumns = [
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
      title: '移除',
      render: (col, record, _index) => {
        return (
          <Button
            type="text"
            style={{ padding: 0 }}
            onClick={() => {
              handleDelete(record._id)
            }}
          >
            删除
          </Button>
        )
      },
    },
  ]

  const proposalColumns = [
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
      dataIndex: 'created',
      key: 'created',
      render: (col, record, _index) => dayjs(record.begin).format('YYYY-MM-DD HH:mm:ss'),
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
      title: '移除',
      render: (col, record, _index) => {
        return (
          <Button
            type="text"
            style={{ padding: 0 }}
            onClick={() => {
              handleDeleteProposal(record._id)
            }}
          >
            删除
          </Button>
        )
      },
    },
  ]

  const labelMap = {
    title: '技术名称',
    application_date: '日期',
    description: '技术描述',
    remark: '备注',
    document_id: '技术编号',
    ipc_id: 'ipc分类号',
  }

  const currentData = Object.entries(props.data)
    .filter(([key, value]) => {
      return key in labelMap
    })
    .map(([key, value]) => {
      return {
        label: labelMap[key],
        value: value.toString(),
      }
    })

  const handleDelete = (id) => {
    axios
      .put(`/api/patent`, {
        _id: id,
        technologyId: props.data._id,
        isEdit: true,
      })
      .finally(() => {
        Message.success('删除成功')

        props.setUpdated((prev) => !prev)
      })
  }

  const handleDeleteProposal = (id) => {
    axios
      .put(`/api/proposal`, {
        _id: id,
        technologyId: props.data._id,
        isEdit: true,
      })
      .finally(() => {
        Message.success('删除成功')

        props.setUpdated((prev) => !prev)
      })
  }

  return (
    <>
      <Spin block loading={props.loading}>
        <Descriptions title="基础信息" data={currentData} layout="inline-vertical" />
      </Spin>
      <Divider />
      <Descriptions title="关联信息" layout="inline-vertical" />
      <Tabs defaultActiveTab="1">
        <TabPane key="1" title="专利">
          <Button onClick={() => setVisible(true)}>关联专利</Button>
          <Spin block loading={props.relationLoading}>
            <Table rowKey="_id" columns={patentColumns} data={props.relationPatentData} style={{ marginTop: 10 }} />
          </Spin>
        </TabPane>
        <TabPane key="2" title="提案">
          <Button onClick={() => setVisible(true)}>关联提案</Button>
          <Spin block loading={props.relationLoading}>
            <Table columns={proposalColumns} data={props.relationProposalData} style={{ marginTop: 10 }} />
          </Spin>
        </TabPane>
      </Tabs>

      <DrawerProduct visible={visible} setVisible={setVisible} technologyId={props.data._id} setUpdated={props.setUpdated} />
    </>
  )
}

export default Content
