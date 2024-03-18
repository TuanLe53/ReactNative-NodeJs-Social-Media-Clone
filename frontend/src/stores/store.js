import { create } from 'zustand';
import { createPostSlice } from './postSlice';
import { createUserPostSlice } from './userPostSlice';

export const useBoundStore = create((...a) => ({
    ...createPostSlice(...a),
    ...createUserPostSlice(...a),
}));