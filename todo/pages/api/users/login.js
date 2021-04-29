import axios from 'axios'


export default async function loginHandler(req, res) {
  const databaseApi = 'http://localhost:3001'
  const { email, password } = req.body
  const input = { email, password }
  const response = await axios.post(`${databaseApi}/login`, input) 
  const token = response.data.accessToken
  const { data } = await axios.get(`${databaseApi}/users?email=${email}`)
  const currentUser = data[0] 
  res.status(response.status).json({ access_token: token, email: currentUser.email, id: currentUser.id })
}