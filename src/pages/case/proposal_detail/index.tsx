import useStorage from '@/utils/useStorage'
import { Button, Card, Divider, Grid, Notification, Spin, Tabs, Typography } from '@arco-design/web-react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import BasicMessage from './components/BasicMessage'
import PatentDocument from './components/PatentDocument'
import axios from 'axios'

const Row = Grid.Row
const Col = Grid.Col

const TabPane = Tabs.TabPane

export default function ProposalDetail() {
  const history = useHistory()
  const [value] = useStorage('user_info')

  const [selectTabs, setSelectTabs] = useState('1')
  const [data, setData] = useState([])

  const getProposalList = async (id) => {
    const res = await axios.get(`/api/proposal?_id=${id}`)

    setData(res.data.data)

    if (res.data.data[0].reanson) {
      Notification.warning({
        title: '驳回原因',
        content: res.data.data[0].reanson,
      })
    }
  }

  useEffect(() => {
    const url = window.location.href
    const id = url.split('/').pop()

    getProposalList(id)
  }, [])

  return (
    <Card>
      <Row className="grid-demo">
        <Col span={8} push={16}></Col>
        <Col span={16} pull={8}>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => {
              history.push('/case/proposal')
            }}
          >
            返回
          </Button>

          <span>{JSON.parse(value).phone}</span>
        </Col>
      </Row>

      <Divider />

      <Tabs
        activeTab={selectTabs}
        onChange={(key) => {
          setSelectTabs(key)
        }}
      >
        <TabPane key="1" title="基础信息">
          <Typography.Paragraph style={{ textAlign: 'center', marginTop: 20 }}>{data && data.length > 0 ? <BasicMessage data={data} /> : <Spin />}</Typography.Paragraph>
        </TabPane>
        <TabPane key="2" title="文档详情">
          <Typography.Paragraph style={{ textAlign: 'center', marginTop: 20 }}>
            <PatentDocument tableData={data} />
          </Typography.Paragraph>
        </TabPane>
      </Tabs>
    </Card>
  )
}
