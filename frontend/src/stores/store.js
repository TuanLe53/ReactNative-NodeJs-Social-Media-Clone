import { create } from 'zustand';
import { createPostSlice } from './postSlice';
import { createUserPostSlice } from './userPostSlice';
import { createCommentSlice } from './commentSlice';

export const useBoundStore = create((...a) => ({
    ...createPostSlice(...a),
    ...createUserPostSlice(...a),
    ...createCommentSlice(...a),
}));