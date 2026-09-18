import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken
}

const authConfig = () => {
  if (!token) {
    return {}
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)

  return response.data
}

const create = async blog => {
  const response = await axios.post(
    baseUrl,
    blog,
    authConfig()
  )

  return response.data
}

const update = async (id, blog) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    blog,
    authConfig()
  )

  return response.data
}

const remove = async id => {
  await axios.delete(
    `${baseUrl}/${id}`,
    authConfig()
  )
}

export default {
  setToken,
  getAll,
  create,
  update,
  remove
}
