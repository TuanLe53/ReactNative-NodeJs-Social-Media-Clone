export const createCommentSlice = (set) => ({
    comments: [],
    setComments: (comments) => set({ comments }),
    addComment: (comment) => set(state => (
        {comments: [comment, ...state.comments]}
    ))
});