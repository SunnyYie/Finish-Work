// 读取文件内容到ArrayBuffer
export function readFileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // 注册文件读取完成后的回调函数
    reader.onload = function (event) {
      const arrayBuffer = event.target.result
      resolve(arrayBuffer)
    }

    // 读取文件内容到ArrayBuffer
    reader.readAsArrayBuffer(file)
  })
}

// 将ArrayBuffer转为十六进制字符串
export function arrayBufferToHexString(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer)
  let hexString = ''
  for (let i = 0; i < uint8Array.length; i++) {
    const hex = uint8Array[i].toString(16).padStart(2, '0')
    hexString += hex
  }
  return hexString
}

export function hexStringToArrayBuffer(hexString) {
  // 如果字符串长度为奇数，添加一个前导零
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString
  }

  // 创建一个新的Uint8Array，长度为字符串长度的一半（因为一个十六进制字符代表4位二进制）
  const buffer = new Uint8Array(hexString.length / 2)

  // 遍历十六进制字符串，每两个字符转换为一个字节
  for (let i = 0; i < hexString.length; i += 2) {
    // 使用parseInt将两个字符的十六进制转换为十进制，并指定基数为16
    buffer[i / 2] = parseInt(hexString.substr(i, 2), 16)
  }

  // 使用Uint8Array创建一个ArrayBuffer
  return buffer.buffer
}
