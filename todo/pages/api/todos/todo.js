import axios from 'axios'

export default async function handler(req, res) {
  const method = req.method
  const id = req.query.id
  const databaseApi= 'http://localhost:3001'
  let response
  let data
  const { title, userId, isDone } = req.body
  console.log(method)
  switch(method) {
    case 'GET' : 
      response = await axios.get(`${databaseApi}/todos?userId=${id}`) 
      data = response.data
      res.status(200).json(data)
      break
    case 'POST':
      const newTodo = { title, userId, isDone }
      response = await axios.post(`${databaseApi}/todos`, newTodo)
      data = response.data
      res.status(201).json(data)
      break
    case 'DELETE':
      response = await axios.delete(`${databaseApi}/todos/${id}`)
      res.status(response.status).json({ message: 'Success Delete Todo' })
      break
    case 'PATCH':
      const updatedTodo = { title, userId, isDone }
      response = await axios.patch(`${databaseApi}/todos/${id}`, updatedTodo)
      res.status(200).json({message: 'ok lur'})
      break
    case 'PUT':
      const editedTodo = { title, userId, isDone }
      response = await axios.put(`${databaseApi}/todos/${id}`, editedTodo)
      res.status(response.status).json({ message: 'todo berhasil di edit lur' })
    default :
      response = await axios.get(`${databaseApi}/todos?userId=${id}`)
      data = response.data
  }
  

}