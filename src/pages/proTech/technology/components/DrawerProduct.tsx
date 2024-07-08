import { patentLegalStatus, patentStatus } from '@/pages/case/patent/patent.enum'
import useStorage from '@/utils/useStorage'
import { Drawer, Input, Tabs, Table, Tag } from '@arco-design/web-react'
import TabPane from '@arco-design/web-react/es/Tabs/tab-pane'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { status } from '@/pages/case/proposal/types/status,enum'

export default function DrawerProduct(props) {
  const { visible, setVisible, technologyId } = props
  const [value] = useStorage('user_info')
  const [patentData, setPatentData] = useState()
  const [proposalData, setProposalData] = useState()

  const [selectedRowKeys, setSelectedRowKeys] = useState([0])
  const [selectProposalKeys, setSelectProposalKeys] = useState([0])
  const index = useRef(1)

  const [tabs, setTabs] = useState('1')

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
  ]

  const getPatentList = async () => {
    const res = await axios.get(`/api/patent/${JSON.parse(value)._id}`)
    setPatentData(
      res.data.data.map((item) => {
        return {
          ...item,
          index: index.current++,
        }
      }),
    )
  }

  const getProposalList = async () => {
    const res = await axios.get(`/api/proposal/${JSON.parse(value)._id}`)
    setProposalData(
      res.data.data.map((item) => {
        return {
          ...item,
          index: index.current++,
        }
      }),
    )
  }

  const handleCreateProductPatent = () => {
    if (tabs === '1') {
      axios.put('/api/patent', { patentIds: selectedRowKeys, technologyId: technologyId }).then((res) => {
        setVisible(false)
        setSelectedRowKeys([])
        props.setUpdated((prev) => !prev)
      })
    } else {
      axios.put('/api/proposal', { proposalIds: selectProposalKeys, technologyId: technologyId }).then((res) => {
        setVisible(false)
        setSelectProposalKeys([])
        props.setUpdated((prev) => !prev)
      })
    }

    setTabs('1')
  }

  useEffect(() => {
    getPatentList()
    getProposalList()
  }, [])

  return (
    <Drawer
      width={850}
      title={<span>选择专利或提案 </span>}
      visible={visible}
      onOk={() => {
        handleCreateProductPatent()
      }}
      onCancel={() => {
        setVisible(false)
        setSelectedRowKeys([])
        setTabs('1')
      }}
    >
      <Input.Search placeholder="专利名称、提案名称、案件编号、申请号、支持批量搜索"></Input.Search>

      <Tabs defaultActiveTab="1" activeTab={tabs} onChange={setTabs}>
        <TabPane key="1" title="专利">
          <Table
            rowKey="_id"
            columns={patentColumns}
            data={patentData}
            style={{ marginTop: 10 }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                setSelectedRowKeys(selectedRowKeys as any)
              },
            }}
          />
        </TabPane>
        <TabPane key="2" title="提案">
          <Table
            rowKey="_id"
            columns={proposalColumns}
            data={proposalData}
            style={{ marginTop: 10 }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectProposalKeys,
              onChange: (selectedRowKeys) => {
                setSelectProposalKeys(selectedRowKeys as any)
              },
            }}
          />
        </TabPane>
      </Tabs>
    </Drawer>
  )
}
