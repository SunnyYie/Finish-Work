import { Tabs, Typography } from '@arco-design/web-react'
import TodoTable from './TodoTable'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { patentLegalStatus } from '../../patent/patent.enum'
const TabPane = Tabs.TabPane

const Style = {
  textAlign: 'center',
  marginTop: 20,
}

function App() {
  const [activeTab, setActiveTab] = useState(patentLegalStatus['待审查'])

  const [data, setData] = useState([])

  const getProposalList = async (status) => {
    const res = await axios.get(`/api/patent?legal_status=${status}`)

    setData(res.data.data)
  }

  useEffect(() => {
    getProposalList(activeTab)
  }, [activeTab])

  return (
    <div>
      <Tabs key="title" tabPosition="left" activeTab={activeTab} onChange={setActiveTab as any}>
        <TabPane key={patentLegalStatus['待审查']} title="待审阶段">
          <Typography.Paragraph style={Style as any}>
            <TodoTable data={data} />
          </Typography.Paragraph>
        </TabPane>
        <TabPane key={patentLegalStatus['二次审查']} title="二次审查">
          <Typography.Paragraph style={Style as any}>
            <TodoTable data={data} />
          </Typography.Paragraph>
        </TabPane>
        <TabPane key={patentLegalStatus['授权']} title="已授权">
          <Typography.Paragraph style={Style as any}>
            <TodoTable data={data} />
          </Typography.Paragraph>
        </TabPane>
        <TabPane key={patentLegalStatus['驳回']} title="驳回">
          <Typography.Paragraph style={Style as any}>
            <TodoTable data={data} status={patentLegalStatus['被驳回']} />
          </Typography.Paragraph>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default App
