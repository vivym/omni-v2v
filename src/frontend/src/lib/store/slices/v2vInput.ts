import { StateCreator } from 'zustand'
import { kPredefinedPrompts } from '@/lib/consts'

export interface V2VInputSlice {
  videoUploaded: boolean
  setVideoUploaded: (videoUploaded: boolean) => void

  videoUploading: boolean
  setVideoUploading: (uploading: boolean) => void

  videoUrl: string
  setVideoUrl: (videoUrl: string) => void

  srcVideoFile: File | null
  setSrcVideoFile: (srcVideoFile: File) => void

  srcVideoPreviewUrl: string | null
  setSrcVideoPreviewUrl: (srcVideoPreviewUrl: string | null) => void

  positivePrompt: string
  setPositivePrompt: (positivePrompt: string) => void

  negativePrompt: string
  setNegativePrompt: (negativePrompt: string) => void

  seed: number
  setSeed: (seed: number) => void

  submitting: boolean
  setSubmitting: (submitting: boolean) => void
}

export const createV2VInputSlice: StateCreator<
  V2VInputSlice,
  [],
  [],
  V2VInputSlice
> = (set) => ({
  videoUploaded: false,
  setVideoUploaded: (videoUploaded) => set({ videoUploaded }),

  videoUploading: false,
  setVideoUploading: (videoUploading) => set({ videoUploading }),

  videoUrl: '',
  setVideoUrl: (videoUrl) => set({ videoUrl }),

  srcVideoFile: null,
  setSrcVideoFile: (srcVideoFile) => set({ srcVideoFile }),

  srcVideoPreviewUrl: null,
  setSrcVideoPreviewUrl: (srcVideoPreviewUrl) =>
    set({ srcVideoPreviewUrl }),

  positivePrompt: kPredefinedPrompts[0].positive,
  setPositivePrompt: (positivePrompt) => set({ positivePrompt }),

  negativePrompt: kPredefinedPrompts[0].negative,
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),

  seed: Math.round(Math.random() * 1000000),
  setSeed: (seed) => set({ seed }),

  submitting: false,
  setSubmitting: (submitting) => set({ submitting }),
})
