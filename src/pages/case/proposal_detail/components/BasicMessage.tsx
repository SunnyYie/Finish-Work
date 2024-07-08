import { Descriptions } from '@arco-design/web-react'
import { useMemo } from 'react'
import { status } from '../../proposal/types/status,enum'

export default function BasicMessage(props) {
  const { data } = props

  const Data = [
    {
      label: '提案名称',
      value: 'Socrates',
    },
    {
      label: '提案编号',
      value: '123-1234-1234',
    },
    {
      label: '案件状态',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
    {
      label: '申请日',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ]

  const labelToKeyMap = {
    提案名称: 'title',
    提案编号: 'proposal_id',
    案件状态: 'status',
    申请日: 'created',
  }

  const memoData = useMemo(() => {
    return Data.map((item) => {
      const key = labelToKeyMap[item.label]

      return {
        label: item.label,
        value: key === 'status' ? status[data[0][key]] : data[0][key],
      }
    })
  }, [data])

  return (
    <div>
      <Descriptions column={1} title="基础信息" data={memoData} style={{ marginBottom: 20 }} labelStyle={{ paddingRight: 36 }} />
    </div>
  )
}
