import { Descriptions } from '@arco-design/web-react'
import { useMemo } from 'react'
import { patentLegalStatus, patentStatus } from '../../patent/patent.enum'
import dayjs from 'dayjs'

export default function BasicMessage(props) {
  const { data } = props

  const Data = [
    {
      label: '专利名称',
      value: 'Socrates',
    },
    {
      label: '案件编号',
      value: '123-1234-1234',
    },
    {
      label: '申请号',
      value: 'Beijing',
    },
    {
      label: '法律状态',
      value: 'Beijing',
    },
    {
      label: '案件状态',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
    {
      label: '申请人',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
    {
      label: '申请日',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
    {
      label: '专利类型',
      value: 'Yingdu Building, Zhichun Road, Beijing',
    },
  ]

  const labelToKeyMap = {
    专利名称: 'title',
    案件编号: 'document_id',
    申请号: 'patent_id',
    法律状态: 'legal_status',
    案件状态: 'status',
    申请日: 'application_date',
    申请人: 'applicant',
    专利类型: 'patent_type',
  }

  const memoData = useMemo(() => {
    return Data.map((item) => {
      const key = labelToKeyMap[item.label]

      if (key === 'legal_status') {
        return {
          label: item.label,
          value: patentLegalStatus[`${data[0][key]}`],
        }
      } else if (key === 'status') {
        return {
          label: item.label,
          value: patentStatus[`${data[0][key]}`],
        }
      } else if (key === 'application_date') {
        return {
          label: item.label,
          value: dayjs(data[0][key]).format('YYYY-MM-DD'),
        }
      }

      return {
        label: item.label,
        value: data[0][key],
      }
    })
  }, [data])

  return (
    <div>
      <Descriptions column={1} title="基础信息" data={memoData} style={{ marginBottom: 20 }} labelStyle={{ paddingRight: 36 }} />
    </div>
  )
}
