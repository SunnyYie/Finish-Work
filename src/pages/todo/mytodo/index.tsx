import { Card, Spin, Tabs, Typography } from '@arco-design/web-react'
import TodoTable from './components/TodoTable'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useStorage from '@/utils/useStorage'

const TabPane = Tabs.TabPane

const TAB_PANES = [
  { key: '1', title: '全部' },
  { key: '2', title: '提案' },
  { key: '3', title: '专利' },
]

function App() {
  const [todoData, setTodoData] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [childTab, setChildTab] = useState('1')

  const [loading, setLoading] = useState(false)

  const [value] = useStorage('user_info')

  const getTodoData = async () => {
    if (JSON.parse(value).role === 'student') {
      if (activeTab === '1') {
        const param = `?finished=${false}&user_id=${JSON.parse(value)._id}`
        if (childTab === '1') {
          setLoading(true)
          const res1 = await axios.get(`/api/patent${param}`)
          const res2 = await axios.get(`/api/proposal${param}`)

          setTodoData([...res1.data.data, ...res2.data.data])
          setLoading(false)
        } else if (childTab === '3') {
          setLoading(true)

          axios.get(`/api/patent${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        } else {
          setLoading(true)

          axios.get(`/api/proposal${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        }
      } else {
        const param = `?finished=${true}&user_id=${JSON.parse(value)._id}`
        if (childTab === '1') {
          setLoading(true)

          const res1 = await axios.get(`/api/patent${param}`)
          const res2 = await axios.get(`/api/proposal${param}`)

          setTodoData([...res1.data.data, ...res2.data.data])
          setLoading(false)
        } else if (childTab === '3') {
          setLoading(true)

          axios.get(`/api/patent${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        } else {
          setLoading(true)
          axios.get(`/api/proposal${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        }
      }
    } else {
      if (activeTab === '1') {
        const param = `?finished=${false}`
        if (childTab === '1') {
          setLoading(true)

          const res1 = await axios.get(`/api/patent${param}`)
          const res2 = await axios.get(`/api/proposal${param}`)

          setTodoData([...res1.data.data, ...res2.data.data])
          setLoading(false)
        } else if (childTab === '3') {
          setLoading(true)

          axios.get(`/api/patent${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        } else {
          setLoading(true)

          axios.get(`/api/proposal${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        }
      } else {
        const param = `?finished=${true}`
        if (childTab === '1') {
          setLoading(true)

          const res1 = await axios.get(`/api/patent${param}`)
          const res2 = await axios.get(`/api/proposal${param}`)

          setTodoData([...res1.data.data, ...res2.data.data])
          setLoading(false)
        } else if (childTab === '3') {
          setLoading(true)

          axios.get(`/api/patent${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        } else {
          setLoading(true)

          axios.get(`/api/proposal${param}`).then((res) => {
            setTodoData(res.data.data)
            setLoading(false)
          })
        }
      }
    }
  }

  useEffect(() => {
    getTodoData()
  }, [childTab, activeTab])

  return (
    <div>
      <Tabs key="card" tabPosition={'left'} activeTab={activeTab} onChange={setActiveTab}>
        <TabPane key="1" title="待办理">
          <Typography.Paragraph style={{ textAlign: 'center', marginTop: 20 }}>
            <Card>
              <Tabs defaultActiveTab="1" activeTab={childTab} onChange={setChildTab}>
                {TAB_PANES.map((pane) => (
                  <TabPane key={pane.key} title={pane.title}>
                    <Typography.Paragraph>
                      <Spin block loading={loading}>
                        <TodoTable todoData={todoData} />
                      </Spin>
                    </Typography.Paragraph>
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Typography.Paragraph>
        </TabPane>
        <TabPane key="2" title="已办理">
          <Typography.Paragraph style={{ textAlign: 'center', marginTop: 20 }}>
            <Card>
              <Tabs defaultActiveTab="1" activeTab={childTab} onChange={setChildTab}>
                {TAB_PANES.map((pane) => (
                  <TabPane key={pane.key} title={pane.title}>
                    <Spin block loading={loading}>
                      <TodoTable status={'已办理'} todoData={todoData} />
                    </Spin>
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Typography.Paragraph>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default App
