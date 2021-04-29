import axios from 'axios'

export default async function registerHandler(req, res) {
  try {
    const { email, password } = req.body
    const data = { email, password }
    const response = await axios.post('http://localhost:3001/users', data)
    res.status(response.status).json({ message: 'Success Creating Account' }) 
  } catch(err) {
    res.status(400).json({ message: err.response.data })
  }

}

