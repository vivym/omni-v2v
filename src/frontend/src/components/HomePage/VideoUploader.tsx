'use client'

import clsx from 'clsx'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, TextInput } from 'flowbite-react'
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Player, Ui, Video } from '@vime/react'
import { useBoundStore } from '@/lib/store'

function DouyinIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1024 1024"
      preserveAspectRatio="none"
      {...props}
    >
      <path d="M937.4 423.9c-84 0-165.7-27.3-232.9-77.8v352.3c0 179.9-138.6 325.6-309.6 325.6S85.3 878.3 85.3 698.4c0-179.9 138.6-325.6 309.6-325.6 17.1 0 33.7 1.5 49.9 4.3v186.6c-15.5-6.1-32-9.2-48.6-9.2-76.3 0-138.2 65-138.2 145.3 0 80.2 61.9 145.3 138.2 145.3 76.2 0 138.1-65.1 138.1-145.3V0H707c0 134.5 103.7 243.5 231.6 243.5v180.3l-1.2 0.1"></path>
    </svg>
  )
}

function BilibiliIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1024 1024"
      preserveAspectRatio="none"
      {...props}
    >
      <path d="M977.2 208.2c33.4 36.2 48.8 79.4 46.6 131.4v404.8c-0.8 52.8-18.4 96.2-53 130.2-34.4 34-78.2 51.8-131 53.4H184.04c-52.9-1.6-96.42-19.6-130.56-54.4C19.364 838.8 1.534 793 0 736.4V339.6c1.534-52 19.364-95.2 53.48-131.4C87.62 175.5 131.14 157.54 184.04 156h58.76L192.1 104.38c-11.5-11.46-17.26-26-17.26-43.58 0-17.6 5.76-32.12 17.26-43.594C203.6 5.736 218.2 0 235.8 0s32.2 5.736 43.8 17.206L426.2 156h176l149-138.794C763.4 5.736 778.4 0 796 0c17.6 0 32.2 5.736 43.8 17.206 11.4 11.474 17.2 25.994 17.2 43.594 0 17.58-5.8 32.12-17.2 43.58L789.2 156h58.6c52.8 1.54 96 19.5 129.4 52.2z m-77.6 139.4c-0.8-19.2-7.4-34.8-21.4-47-10.4-12.2-28-18.8-45.4-19.6H192.1c-19.18 0.8-34.9 7.4-47.16 19.6-12.28 12.2-18.8 27.8-19.56 47v388.8c0 18.4 6.52 34 19.56 47s28.76 19.6 47.16 19.6H832.8c18.4 0 34-6.6 46.6-19.6 12.6-13 19.4-28.6 20.2-47V347.6z m-528.6 85.4c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.4 12.6-28 19-47.2 19-19.2 0-35-6.4-47.2-19-12.2-12.6-18.8-28-19.6-46.4v-66.6c0.8-18.2 7.6-33.8 20.2-46.4 12.6-12.6 26.4-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z m383 0c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.2 12.6-28 19-47.2 19-19.2 0-34.8-6.4-47.2-19-14-12.6-18.8-28-19.4-46.4v-66.6c0.6-18.2 7.4-33.8 20-46.4 12.6-12.6 28.2-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z"></path>
    </svg>
  )
}

function UploadZone() {
  const [videoSrcUrl, setVideoSrcUrl] = useState<string>('')
  const [parsingVideoSrcUrl, setParsingVideoSrcUrl] = useState<boolean>(false)
  const [readingClipboard, setReadingClipboard] = useState<boolean>(false)
  const setSrcVideoFile = useBoundStore((state) => state.setSrcVideoFile)
  const setSrcVideoPreviewUrl = useBoundStore((state) => state.setSrcVideoPreviewUrl)

  const parseVideoSrcUrl = async (url: string) => {
    setParsingVideoSrcUrl(true)

    setParsingVideoSrcUrl(false)
  }

  const onGetVideoUrlFromClipboard = async () => {
    setReadingClipboard(true)
    const text = await navigator.clipboard.readText()
    setReadingClipboard(false)

    const url = text.match(/https?:\/\/[^\s]+/)?.[0]
    if (url) {
      setVideoSrcUrl(url)

      await parseVideoSrcUrl(url)
    } else {
      // TODO: show error
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return
    }

    setSrcVideoFile(acceptedFiles[0])
    setSrcVideoPreviewUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [setSrcVideoFile, setSrcVideoPreviewUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxSize: 128 * 1024 * 1024, // 128MB
    maxFiles: 1,
    onDrop,
  })

  return (
    <>
      <div
        className={clsx(
          'flex flex-1 justify-center items-center py-10 hover:bg-gray-50',
          !isDragActive && 'hover:cursor-pointer',
          isDragActive && 'bg-gray-50',
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-500 drak:text-gray-400" />
          {isDragActive ? (
            <p className="mt-6">请在此区域<span className="font-semibold">释放</span>文件</p>
          ): (
            <p className="mt-6">
              将视频<span className="font-semibold">拖拽</span>至此区域
              或<span className="font-semibold">点击</span>此区域上传视频
            </p>
          )}
          <p className="mt-2">支持mp4、mov, 最大128MB</p>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center py-10 border-t md:border-l md:border-t-0 border-gray-400 border-dashed hover:bg-gray-50">
        <div className="flex flex-col gap-y-2">
          <div className="flex mb-4 justify-center flex-row gap-x-8">
            <DouyinIcon className="h-10 w-10 text-gray-500 drak:text-gray-400" />
            <BilibiliIcon className="h-10 w-10 text-gray-500 drak:text-gray-400" />
          </div>
          <div className="flex flex-row gap-x-2">
            <TextInput
              className="lg:w-64"
              type="text"
              placeholder="请输入视频链接"
              value={videoSrcUrl}
              onChange={(e) => setVideoSrcUrl(e.target.value)}
            />
            <Button color="blue" size="sm" onClick={() => parseVideoSrcUrl(videoSrcUrl)}>获取视频</Button>
          </div>
          <Button
            color="blue"
            size="sm"
            onClick={onGetVideoUrlFromClipboard}
            isProcessing={readingClipboard}
          >
            从剪贴板获取视频
          </Button>
        </div>
      </div>
    </>
  )
}

function PreviewVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const setSrcVideoPreviewUrl = useBoundStore((state) => state.setSrcVideoPreviewUrl)

  return (
    <div className="flex flex-1 bg-white justify-center items-center">
      <div className="relative flex-1">
        <Player controls>
          <Video>
            <source data-src={videoUrl} type="video/mp4" />
          </Video>
          <Ui></Ui>
        </Player>
        <Button
          className="absolute top-2 right-2"
          color="gray"
          size="xs"
          onClick={() => setSrcVideoPreviewUrl(null)}
        >
          <XMarkIcon className="w-4 mr-1" />
          <span>重选视频</span>
        </Button>
      </div>
    </div>
  )
}

export function VideoUploader() {
  const srcVideoPreviewUrl = useBoundStore((state) => state.srcVideoPreviewUrl)

  return (
    <div className="flex flex-col rounded-md overflow-hidden bg-gray-100 md:flex-row">
      {srcVideoPreviewUrl ? (
        <PreviewVideoPlayer videoUrl={srcVideoPreviewUrl} />
      ) : (
        <UploadZone />
      )}
    </div>
  )
}
