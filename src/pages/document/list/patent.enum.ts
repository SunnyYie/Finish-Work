export enum patentType {
  // 发明专利
  invention = 'invention',
  // 实用新型
  utility_model = 'utility_model',
  // 外观设计
  design = 'design',
}

export enum patentStatus {
  // 授权
  authorization = '授权',
  // 待审查
  substantive_examination = '待审查',
  // 驳回
  rejection = '驳回',
}

export enum patentLegalStatus {
  // 待审查
  substantive_examination = '待审查',
  // 二次审查
  secondary_examination = '二次审查',
  // 授权
  authorization = '授权',
  // 驳回
  rejection = '驳回',
  '待审查' = 'substantive_examination',
  '二次审查' = 'secondary_examination',
  '授权' = 'authorization',
  '驳回' = 'rejection',
}

export enum patentPaymentStatus {
  // 未缴费
  unpaid = '未缴费',
  // 已缴费
  paid = '已缴费',
}
