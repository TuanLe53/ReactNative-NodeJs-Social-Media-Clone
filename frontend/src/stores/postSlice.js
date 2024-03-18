export const createPostSlice = (set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    removePost: (post_id) => set(state => ({
        posts: state.posts.filter(post => post.id !== post_id)
    }))
})