export const createUserPostSlice = (set) => ({
    user_posts: [],
    setUserPosts: (posts) => set({ posts }),
    removeUserPost: (post_id) => set(state => ({
        posts: state.posts.filter(post => post.id !== post_id)
    }))
});