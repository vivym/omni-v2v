'use client'

import { Button, Label, Modal, Progress, Select, Spinner, TextInput } from 'flowbite-react'
import { sha256 } from 'js-sha256'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import { useCallback, useMemo, useState } from 'react'
import { kPredefinedPrompts } from '@/lib/consts'
import { env } from '@/lib/env.mjs'
import { http } from '@/lib/http'
import { getOSSClient } from '@/lib/oss'
import { useBoundStore } from '@/lib/store'

interface Task {
  id: string
}

interface TaskResponse {
  task: Task
}

export function PromptInput() {
  const [predefinedPromptIndex, setPredefinedPromptIndex] = useState<number>(0)
  const [calculatingVideoHash, setCalculatingVideoHash] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [taskId, setTaskId] = useState<string | null>(null)

  const isManuelPrompt = useMemo(
    () =>  kPredefinedPrompts[predefinedPromptIndex].name === '自定义',
    [predefinedPromptIndex],
  )
  const resultUrl = useMemo(() => `${env.NEXT_PUBLIC_BASE_URL}/${taskId}`, [taskId])

  const positivePrompt = useBoundStore((state) => state.positivePrompt)
  const setPositivePrompt = useBoundStore((state) => state.setPositivePrompt)
  const negativePrompt = useBoundStore((state) => state.negativePrompt)
  const setNegativePrompt = useBoundStore((state) => state.setNegativePrompt)
  const seed = useBoundStore((state) => state.seed)
  const setSeed = useBoundStore((state) => state.setSeed)
  const srcVideoFile = useBoundStore((state) => state.srcVideoFile)
  const srcVideoPreviewUrl = useBoundStore((state) => state.srcVideoPreviewUrl)

  const router = useRouter()

  const onChangePredefinedPrompt = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value)
    setPredefinedPromptIndex(index)

    const predefinedPrompt = kPredefinedPrompts[index]
    setPositivePrompt(predefinedPrompt.positive)
    setNegativePrompt(predefinedPrompt.negative)
  }, [setPredefinedPromptIndex, setPositivePrompt, setNegativePrompt])

  const onSubmit = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!srcVideoPreviewUrl || !srcVideoFile) {
      // TODO: show error
      return
    }

    // #1. calculate video sha256
    setCalculatingVideoHash(true)
    const hasher = sha256.create()
    hasher.update(await srcVideoFile.arrayBuffer())
    const videoSha256 = hasher.hex()
    console.log('videoSha256', videoSha256)
    setCalculatingVideoHash(false)

    // #2. upload video to oss
    const oss = await getOSSClient()
    const res = await oss.multipartUpload(`upload_videos/${videoSha256}.mp4`, srcVideoFile, {
      progress(p) {
        setUploadProgress(Math.min(Math.round(p * 100), 100))
      },
      parallel: 4,
      partSize: 1 * 1024 * 1024, // 1MB
      mime: srcVideoFile.type,
    })
    console.log('res', res)

    // #3. submit generation task
    const taskCreation = {
      video_oss_bucket: res.bucket,
      video_oss_key: res.name,
      positive_prompt: positivePrompt,
      negative_prompt: negativePrompt,
      seed: seed,
    }
    console.log('taskCreation', taskCreation)
    const rsp = await http.post<TaskResponse>('/task', taskCreation)

    const task = rsp.data.task
    console.log('created task', task)
    setTaskId(task.id)

    // #4. show result
    setModalOpen(true)
  }, [positivePrompt, negativePrompt, srcVideoPreviewUrl, srcVideoFile, seed, setUploadProgress, setTaskId, setModalOpen])

  return (
    <form className="flex flex-col mt-6 py-6 border-t">
      <div>
        <div className="mb-3 block">
          <Label htmlFor="predefined-prompt" value="预设提示词" />
          <Select
            id="predefined-prompt"
            required
            onChange={onChangePredefinedPrompt}
          >
            {kPredefinedPrompts.map((predefinedPrompt, index) => (
              <option key={index} value={index}>
                {predefinedPrompt.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-3 block">
          <Label htmlFor="positive-prompt" value="正向提示词" />
          <TextInput
            className="mt-1"
            id="positive-prompt"
            placeholder="请输入正向提示词"
            required
            disabled={!isManuelPrompt}
            type="text"
            value={positivePrompt}
            onChange={(e) => setPositivePrompt(e.target.value)}
          />
        </div>

        <div className="mb-3 block">
          <Label htmlFor="negative-prompt" value="反向提示词" />
          <TextInput
            className="mt-1"
            id="negative-prompt"
            placeholder="请输入反向提示词"
            disabled={!isManuelPrompt}
            type="text"
            value={negativePrompt}
            onChange={(e) => setPositivePrompt(e.target.value)}
          />
        </div>

        <div className="mb-6 block">
          <Label htmlFor="seed" value="种子" />
          <TextInput
            className="mt-1"
            id="seed"
            type="number"
            required
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
          />
        </div>

        <Button type="submit" className="w-full" color="blue" onClick={onSubmit}>开始转换</Button>
      </div>

      {
        calculatingVideoHash && (
          <div className="mt-6 flex items-center">
            <Spinner />
            <span className="ml-2 text-center">正在计算视频Hash值...</span>
          </div>
        )
      }

      {
        uploadProgress !== null && (
          <div className="mt-6">
            <Progress
              labelProgress
              labelText
              progress={uploadProgress}
              progressLabelPosition="inside"
              size="lg"
              textLabel={uploadProgress === 100 ? '上传完成' : '正在上传视频...'}
              textLabelPosition="outside"
            />
          </div>
        )
      }

      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        {/* <Modal.Header>任务提交成功</Modal.Header> */}
        <Modal.Body>
          <div className="flex flex-col justify-center">
            <div className="text-xl font-bold p-4 -mt-5 -mx-6 border-b select-none">任务提交成功</div>
            <div className="mt-6 flex-1 flex flex-col items-center gap-y-2">
              <QRCodeCanvas value={resultUrl} size={256} />
              <p className="mt-4 text-center">
                保存二维码，等待任务完成后扫码查看结果，或者点击下方链接查看结果。
              </p>
              <Link className="text-indigo-600 underline italic" href={resultUrl}>{resultUrl}</Link>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-end gap-x-2">
            <Button onClick={() => router.push(resultUrl)}>查看结果</Button>
            <Button color="gray">取消任务</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </form>
  )
}
