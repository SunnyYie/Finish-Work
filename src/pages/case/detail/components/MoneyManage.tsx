import { Button, Grid, Input, Table, TableColumnProps } from '@arco-design/web-react'

const Row = Grid.Row
const Col = Grid.Col

const columns: TableColumnProps[] = [
  {
    title: '专利名称',
    dataIndex: 'name',
  },
  {
    title: '缴费状态',
    dataIndex: 'status',
  },
  {
    title: '专利编号',
    dataIndex: 'doc_id',
  },
  {
    title: '缴费时间',
    dataIndex: 'created_at',
  },
  {
    title: '操作',
    render: () => {
      return (
        <>
          <Button type="text" style={{ padding: 2 }}>
            查看
          </Button>
        </>
      )
    },
  },
]
const data = [
  {
    key: '1',
    name: '三维模型在线预览方法及装置',
    status: '待缴费',
    doc_id: 'ZL-2022111641',
    created_at: '2021-09-01',
    end_at: '2021-10-01',
  },
  {
    key: '2',
    name: '三维模型在线预览方法及装置2',
    status: '已缴费',
    doc_id: 'ZL-2022111642',
    created_at: '2021-09-02',
    end_at: '2021-10-02',
  },
  {
    key: '3',
    name: '三维模型在线预览方法及装置3',
    status: '已缴费',
    doc_id: 'ZL-2022111643',
    created_at: '2021-09-03',
    end_at: '2021-10-03',
  },
]

export default function MoneyManage(props) {
  const { tableData } = props
  return (
    <>
      <Row className="grid-demo">
        <Col span={16} push={8}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ marginRight: 5 }}>新增</Button>
          </div>
        </Col>
        <Col span={8} pull={16}>
          <Input.Search style={{ marginBottom: 20 }} placeholder="请输入文件名称关键字" />
        </Col>
      </Row>
      <Table columns={columns} data={data} />
    </>
  )
}
