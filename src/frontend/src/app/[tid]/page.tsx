'use client'

import { Player, Ui, Video } from '@vime/react'
import { Button, Spinner } from 'flowbite-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { http } from '@/lib/http'
import { getOSSClient } from '@/lib/oss'

interface Task {
  id: string
  video_oss_bucket: string
  video_oss_key: string
  positive_prompt: string
  negative_prompt: string
  seed: number
  src_video_oss_bucket: string | null
  src_video_oss_key: string | null
  tgt_video_oss_bucket: string | null
  tgt_video_oss_key: string | null
  status: string
  message: string | null
  created_at: string
  completed_at: string | null
  views: number
  private: boolean
}

interface TaskResponse {
  task: Task | null
}

export default function ViewPage() {
  const { tid } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [srcVideoUrl, setSrcVideoUrl] = useState<string | null>(null)
  const [tgtVideoUrl, setTgtVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      const { data } = await http.get<TaskResponse>(`/tasks/${tid}`)
      setTask(data.task)

      if (data.task) {
        const srcVideoOssKey = data.task.status === 'completed' ? data.task.src_video_oss_key : data.task.video_oss_key
        const tgtVideoOssKey = data.task.status === 'completed' ? data.task.tgt_video_oss_key : null

        const oss = await getOSSClient()

        if (srcVideoOssKey) {
          setSrcVideoUrl(oss.signatureUrl(srcVideoOssKey))
        }

        if (tgtVideoOssKey) {
          setTgtVideoUrl(oss.signatureUrl(tgtVideoOssKey))
        }
      }
    }

    fetchTask().catch(console.error)
  }, [tid, setTask, setSrcVideoUrl, setTgtVideoUrl])

  const status = useMemo(() => {
    if (!task) {
      return '正在获取任务详情'
    }

    console.log('task', task, task.status)

    if (task.status === 'pending') {
      return '正在排队...'
    } else if (task.status === 'processing') {
      return '正在处理...'
    } else if (task.status === 'completed') {
      return '处理完成.'
    } else if (task.status === 'failed') {
      return '处理失败.'
    } else {
      return `未知状态: ${task.status}.`
    }
  }, [task])

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex gap-x-4 items-center">
        <span className="text-center">任务状态: </span>
        <span>{status}</span>
        {status !== '处理完成.' && status !== '处理失败.' && <Spinner color="success" />}
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <span>生成结果:</span>
          <Button.Group>
            <Button color="gray" size="xs">下载视频</Button>
            <Button color="gray" size="xs">分享视频</Button>
          </Button.Group>
        </div>
        <div className="relative flex-1">
          <Player controls>
            <Video>
              <source data-src={tgtVideoUrl} type="video/mp4" />
            </Video>
            <Ui></Ui>
          </Player>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <p>原始视频:</p>
        <div className="relative flex-1">
          <Player controls>
            <Video>
              <source data-src={srcVideoUrl} type="video/mp4" />
            </Video>
            <Ui></Ui>
          </Player>
        </div>
      </div>

      <div className="flex">
        <div className="w-24">
          正向提示词:
        </div>
        <div className="flex-1">{task?.positive_prompt}</div>
      </div>

      <div className="flex">
        <div className="w-24">
          反向提示词:
        </div>
        <div className="flex-1">{task?.negative_prompt}</div>
      </div>

      <div className="flex">
        <div className="w-24">
          <span>种子：</span>
        </div>
        <div className="flex-1">{task?.seed}</div>
      </div>
    </div>
  )
}
