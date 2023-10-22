import OSS from 'ali-oss'
import { http } from './http'

let ossClient: OSS | null = null

interface STSToken {
  access_key_id: string
  access_key_secret: string
  security_token: string
  expiration: string
}

interface STSTokenResponse {
  token: STSToken
}

async function refreshSTSToken() {
  const { data } = await http.get<STSTokenResponse>('/sts')
  const { token } = data
  return {
    accessKeyId: token.access_key_id,
    accessKeySecret: token.access_key_secret,
    stsToken: token.security_token,
  }
}

export async function getOSSClient() {
  if (!ossClient) {
    const token = await refreshSTSToken()

    ossClient = new OSS({
      region: 'oss-cn-beijing',
      bucket: 'omni-v2v',
      accessKeyId: token.accessKeyId,
      accessKeySecret: token.accessKeySecret,
      stsToken: token.stsToken,
      refreshSTSToken,
      refreshSTSTokenInterval: 20 * 60 * 1000,
    })
  }

  return ossClient
}
