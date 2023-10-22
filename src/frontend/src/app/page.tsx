import { PromptInput } from '@/components/HomePage/PromptInput'
import { VideoUploader } from '@/components/HomePage/VideoUploader'
import { MainLayout } from '@/components/MainLayout'

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
