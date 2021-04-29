import axios from 'axios'


export default async function loginHandler(req, res) {
  try {
    console.log('masuk')
    const databaseApi = 'http://localhost:3001'
    const databaseApi2 = 'https://todo-next-js.herokuapp.com'
    const { email, password } = req.body
    const input = { email, password }
    const response = await axios.post(`${databaseApi2}/login`, input) 
    const token = response.data.accessToken
    const { data } = await axios.get(`${databaseApi2}/users?email=${email}`)
    const currentUser = data[0] 
    res.status(response.status).json({ access_token: token, email: currentUser.email, id: currentUser.id })

  } catch(err) {
    res.status(400).json({ message: 'ups, error' })
  }
}