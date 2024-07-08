import { useEffect, useRef, useState } from 'react'
import { Button, Card, Empty, FormInstance, Layout, Menu } from '@arco-design/web-react'
import { IconApps } from '@arco-design/web-react/icon'
import Content from './components/Content'
import axios from 'axios'
import useStorage from '@/utils/useStorage'
import ModalProduct from './components/ModalProduct'

function Product() {
  const [menuList, setMenuList] = useState([])
  const [fetchDataSource, setFetchDataSource] = useState([])
  const [relationData, setRelationData] = useState([])
  const [relationProposalData, setRelationProposalData] = useState([])

  const [visible, setVisible] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [buttonStatus, setButtonStatus] = useState('create')
  const [loading, setLoading] = useState(false)
  const [relationLoading, setRelationLoading] = useState(false)

  const [selectKey, setSelectKey] = useState('')

  const [value] = useStorage('user_info')
  const formRef = useRef<FormInstance>()

  const handleMenuChange = (key) => {
    setLoading(true)
    setRelationLoading(true)
    axios.get(`/api/product?_id=${key}`).then((res) => {
      setFetchDataSource(res.data.data[0])
      setSelectKey(key)
      setLoading(false)

      // 请求关联数据
      axios.get(`/api/patent?productId=${res.data.data[0]._id}`).then((res) => {
        setRelationData(res.data.data)
        setRelationLoading(false)
      })
      axios.get(`/api/proposal?productId=${res.data.data[0]._id}`).then((res) => {
        setRelationProposalData(res.data.data)
        setRelationLoading(false)
      })
    })
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setRelationLoading(true)
      // 请求产品数据
      axios.get(`/api/product/${JSON.parse(value)._id}`).then((res) => {
        setMenuList(res.data.data)
        setSelectKey(res.data.data[0]._id)
        setFetchDataSource(res.data.data[0])
        setLoading(false)

        // 请求关联数据
        axios.get(`/api/patent?productId=${res.data.data[0]._id}`).then((res) => {
          setRelationData(res.data.data)
          setRelationLoading(false)
        })
        axios.get(`/api/proposal?productId=${res.data.data[0]._id}`).then((res) => {
          setRelationProposalData(res.data.data)
          setRelationLoading(false)
        })
      })
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setRelationLoading(true)
      // 请求产品数据
      axios.get(`/api/product/${JSON.parse(value)._id}`).then((res) => {
        if (selectKey !== '') {
          setMenuList(res.data.data)
          setFetchDataSource(res.data.data.find((item) => item._id === selectKey))
          setLoading(false)

          // 请求关联数据
          axios.get(`/api/patent?productId=${res.data.data.find((item) => item._id === selectKey)._id}`).then((res) => {
            setRelationData(res.data.data)
            setRelationLoading(false)
          })
          axios.get(`/api/proposal?productId=${res.data.data.find((item) => item._id === selectKey)._id}`).then((res) => {
            setRelationProposalData(res.data.data)
            setRelationLoading(false)
          })
        }
      })
    }

    fetchData()
  }, [updated])

  return (
    <Card>
      <Layout className="byte-layout-collapse-demo">
        <Layout.Sider style={{ width: 200 }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
              shape="round"
              type="primary"
              style={{ width: '80%' }}
              onClick={() => {
                setVisible(true)
                setButtonStatus('create')

                formRef.current.resetFields()
              }}
            >
              添加分类
            </Button>
          </div>
          <Menu style={{ width: 300, minHeight: 600 }} hasCollapseButton mode="pop" onClickMenuItem={handleMenuChange} selectedKeys={[selectKey]}>
            {menuList.map((item) => {
              return (
                <Menu.Item key={item._id as any}>
                  <IconApps />
                  {item.title}
                  <Button
                    type="text"
                    onClick={() => {
                      axios.delete(`/api/product/${item._id}`).then(() => {
                        setUpdated((prev) => !prev)
                      })
                    }}
                  >
                    删除
                  </Button>
                </Menu.Item>
              )
            })}
          </Menu>
        </Layout.Sider>
        {menuList.length > 0 ? (
          <Layout.Content style={{ padding: '30px' }}>
            <>
              <Button
                style={{ marginBottom: 10 }}
                onClick={() => {
                  formRef.current.setFieldsValue(fetchDataSource)

                  setButtonStatus('update')
                  setVisible(true)
                }}
              >
                编辑信息
              </Button>
              <Content data={fetchDataSource} relationPatentData={relationData} relationProposalData={relationProposalData} setUpdated={setUpdated} loading={loading} relationLoading={relationLoading} />
            </>
          </Layout.Content>
        ) : (
          <Empty />
        )}
      </Layout>

      <ModalProduct visible={visible} setVisible={setVisible} formRef={formRef} setUpdated={setUpdated} buttonStatus={buttonStatus} />
    </Card>
  )
}

export default Product
