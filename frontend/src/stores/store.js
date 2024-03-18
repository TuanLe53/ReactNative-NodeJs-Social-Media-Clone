import { create } from 'zustand';
import { createPostSlice } from './postSlice';
import { createUserPostSlice } from './userPostSlice';

const useBoundStore = create((...a) => ({
    ...createPostSlice(...a),
    ...createUserPostSlice(...a),
}));