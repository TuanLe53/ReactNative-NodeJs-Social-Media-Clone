export const createUserPostSlice = (set) => ({
    user_posts: [],
    setUserPosts: (user_posts) => set({ user_posts }),
    removeUserPost: (post_id) => set(state => ({
        user_posts: state.user_posts.filter(post => post.id !== post_id)
    }))
});