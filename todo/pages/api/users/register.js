import axios from 'axios'

export default async function registerHandler(req, res) {
  const { email, password } = req.body
  const data = { email, password }
  const response = await axios.post('http://localhost:3001/users', data)
  res.status(response.status).json({ message: 'Success Creating Account' }) 
}

