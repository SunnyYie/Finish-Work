import { v4 as uuidv4 } from 'uuid'

export default function createUUID() {
  const uuid = uuidv4()

  return uuid.split('-')?.[0] || Math.random().toString(36).slice(-8)
}
