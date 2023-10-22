import axios from 'axios'
import { env } from './env.mjs'

export const http = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
})
