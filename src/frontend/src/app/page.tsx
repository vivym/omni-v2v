import { MainLayout } from '@/components/MainLayout'
import { VideoUploader } from '@/components/HomePage/VideoUploader'
import { PromptInput } from '@/components/HomePage/PromptInput'

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <VideoUploader />
        <PromptInput />
      </div>
    </MainLayout>
  )
}
