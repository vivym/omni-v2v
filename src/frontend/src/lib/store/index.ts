import { create } from 'zustand'
import { createV2VInputSlice, V2VInputSlice } from './slices/v2vInput'

export const useBoundStore = create<V2VInputSlice>()((...a) => ({
    ...createV2VInputSlice(...a),
}))
