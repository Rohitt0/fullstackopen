import { create } from 'zustand'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import persistentUser from './services/persistentUser'

const useStore = create((set, get) => ({
  blogs: [],
  users: [],
  user: persistentUser.getUser(),
  notification: null,

  actions: {
    initialize: async () => {
      const [blogs, users] = await Promise.all([
        blogService.getAll(),
        userService.getAll()
      ])

      set({
        blogs: blogs.sort((a, b) => b.likes - a.likes),
        users
      })

      const user = get().user
      blogService.setToken(user?.token || null)
    },

    notify: (message, type = 'success') => {
      set({ notification: { message, type } })

      const timer = get().notificationTimer
      if (timer) {
        clearTimeout(timer)
      }

      const newTimer = setTimeout(() => {
        set({
          notification: null,
          notificationTimer: null
        })
      }, 5000)

      set({ notificationTimer: newTimer })
    },

    login: async credentials => {
      const user = await loginService.login(credentials)
      persistentUser.saveUser(user)
      blogService.setToken(user.token)
      set({ user })
      get().actions.notify('login successful')
      return user
    },

    logout: () => {
      persistentUser.removeUser()
      blogService.setToken(null)
      set({ user: null })
      get().actions.notify('logged out')
    },

    createBlog: async blog => {
      const createdBlog = await blogService.create(blog)

      set(state => ({
        blogs: [...state.blogs, createdBlog].sort(
          (a, b) => b.likes - a.likes
        )
      }))

      get().actions.notify(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )

      await get().actions.refreshUsers()
      return createdBlog
    },

    likeBlog: async blog => {
      const updatedBlog = await blogService.update(
        blog.id,
        {
          ...blog,
          likes: blog.likes + 1
        }
      )

      set(state => ({
        blogs: state.blogs
          .map(current =>
            current.id === updatedBlog.id
              ? updatedBlog
              : current
          )
          .sort((a, b) => b.likes - a.likes)
      }))

      get().actions.notify('blog liked')
      return updatedBlog
    },

    removeBlog: async blog => {
      await blogService.remove(blog.id)

      set(state => ({
        blogs: state.blogs.filter(
          current => current.id !== blog.id
        )
      }))

      await get().actions.refreshUsers()
      get().actions.notify(`blog ${blog.title} removed`)
    },

    refreshUsers: async () => {
      const users = await userService.getAll()
      set({ users })
    },

    addComment: async (blogId, content) => {
      const updatedBlog = await blogService.addComment(
        blogId,
        content
      )

      set(state => ({
        blogs: state.blogs.map(blog =>
          blog.id === updatedBlog.id
            ? updatedBlog
            : blog
        )
      }))

      get().actions.notify('comment added')
      return updatedBlog
    }
  },

  notificationTimer: null
}))

export const useBlogs = () => useStore(state => state.blogs)
export const useUsers = () => useStore(state => state.users)
export const useUser = () => useStore(state => state.user)
export const useNotification = () =>
  useStore(state => state.notification)

export const useActions = () => useStore(state => state.actions)

export default useStore
