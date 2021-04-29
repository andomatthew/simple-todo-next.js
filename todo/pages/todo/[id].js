import axios from 'axios'
import { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import AddTodo from '../../components/AddTodo.js'
import EditTodo from '../../components/EditTodo.js'
import  useSWR, { mutate } from 'swr'



//function used by swr
async function fetchData(api) {
  try {
    const { data } = await axios.get(api)
    const todos = data
    let todoIsDone = todos.filter(todo => todo.isDone === true)
    let todoIsNotDone = todos.filter(todo => todo.isDone === false)
    return { todoIsDone, todoIsNotDone }
  } catch(err) {
    console.log(err)
  }

}
const usersApi = 'http://localhost:3001/users'
const todoApiWithId = 'http://localhost:3000/api/todos/todo?id='
const todoApiWithoutId = 'http://localhost:3000/api/todos/todo'

export default function Todo ({ todosIsDone, todosIsNotDone, id, currentUser }) {
  
  const [isLogin, setIsLogin] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [populate, setPopulate] = useState({})
  const router = useRouter()
 
  
  //data fetching, help the page to reactive to some changing
  const { data, error } = useSWR(todoApiWithId + id, fetchData)

  async function addMutation(newTodo) {
    mutate(todoApiWithId + id, { ...data, todosIsNotDone: todosIsNotDone.push(newTodo)} , false)
    const response = await axios.post(todoApiWithoutId, newTodo)
    mutate(todoApiWithId + id)
  }

  async function deleteMutation(todoId) {
    const filteredTodo = todosIsNotDone.filter(todo => todo.id !== todoId)
    mutate(todoApiWithId + todoId, filteredTodo, false)
    const response = await axios.delete(todoApiWithId + todoId)
    mutate(todoApiWithId + id)    
  }

  async function updateMutation(todo) {
    const todoId = todo.id
    const updatedTodo = { ...todo, isDone: true }
    let filteredTodo = todosIsNotDone.filter(todo => todo.id !== todoId)
    filteredTodo.push(updatedTodo)
    mutate(todoApiWithId + todoId, filteredTodo, false)
    const response = await axios.patch(todoApiWithId + todoId, updatedTodo)
    mutate(todoApiWithId + id)
  }

  async function editMutation(todo) {
    const todoId = todo.id
    let filteredTodo = todosIsNotDone.filter(todo => todo.id !== todoId)
    filteredTodo.push(todo)
    mutate(todoApiWithId + todoId, filteredTodo, false)
    const response = await axios.put(todoApiWithId + todoId, todo)
    mutate(todoApiWithId + id)
  }

  function logout() {
    localStorage.setItem('access_token', '')
    setIsLogin(false)
  }

  useEffect(() => {
    setIsLogin(true)
    if(localStorage.getItem('access_token') === '') {
      router.push('/')
    }
  }, [isLogin])

  return (
    <div className="columns">
      <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{height: '100vh'}}>
        <div className="mb-6">
          <h1 className="mb-5 is-size-4 has-text-info">Welcome, {currentUser.email} </h1>
          <div className="field is-grouped is-flex is-justify-content-space-around">
            <button 
              className="button is-small mx-1 has-text-info"
              onClick={logout}
            >Logout
            </button>
            <button className="button is-small mx-1 has-text-info" onClick={() => [setShowAddForm(true), setShowEditForm(false)]}>Add Todo</button>
          </div>
        </div>
        <AddTodo 
          userId={id} 
          showAddForm={showAddForm}
          showEditForm={showEditForm}
          setShowAddForm={setShowAddForm}
          addMutation={addMutation}  
        />
        <EditTodo
          populate={populate}
          showAddForm={showAddForm}
          showEditForm={showEditForm}
          setPopulate={setPopulate}
          editMutation={editMutation}
          setShowEditForm={setShowEditForm}
        />
      </div>

      <div className="column is-flex is-flex-direction-column is-justify-content-center has-background-primary" style={{height: '100vh', borderRight: '1px solid', borderLeft: '1px solid'}}>
        <p className="is-size-5 has-text-info" style={{position: 'absolute', top: '20px', left: '35em'}}>Todo(S)</p>
        <ul className="is-flex is-flex-direction-column px-3" style={{width: '100%', overflowY: 'auto', maxHeight: '80%'}}>
        {
          (data === undefined || data.todoIsNotDone.length === 0) ? <li className="has-text-centered is-size-3">Nothing Todo...</li>:
          data.todoIsNotDone.map(
            todo => 
            <li style={{ borderBottom: '1px solid', borderColor: '#16697'}} className="mb-4 is-flex is-justify-content-space-between pb-2" key={todo.id}>
              <p className="has-text-info">{todo.title}</p>
              <div className="field is-grouped">
                <button className="button is-small mx-1 has-text-info" onClick={() =>deleteMutation(todo.id)}>Delete</button>
                <button className="button is-small mx-1 has-text-info" onClick={() => updateMutation(todo)}>Done</button>
                <button className="button is-small mx-1 has-text-info" onClick={() => [setPopulate(todo), setShowEditForm(true), setShowAddForm(false)]}>Edit</button> 
              </div> 
            </li>
          )
        }
        </ul>
      </div>
      <div className="column is-flex is-flex-direction-column is-justify-content-center has-background-primary" style={{height: '100vh'}}>
        <p className="is-size-5 has-text-info" style={{position: 'absolute', top: '20px', right: '10em'}}>Done</p>
        <ul className="is-flex is-flex-direction-column px-3" style={{width: '100%', overflowY: 'auto', maxHeight: '90%'}}>
          {
            (data === undefined || data.todoIsDone.length === 0) ? <li className="has-text-centered is-size-3">Nothing done yet...</li>:
            data.todoIsDone.map( todo => <li className="mb-4 pb-2 has-text-info" style={{ borderBottom: '1px solid', borderColor: '#16697'}} key={todo.id}>{todo.title}</li>)
          }
        </ul>
      </div>
    </div>
  )

}

// function to get user id for the dynamic paths
export async function getStaticPaths() {

  const { data } = await axios.get(usersApi)
  const users = data
  const paths = users.map((user) => ({
    params: { id: String(user.id) }
  }))
  return { paths, fallback: false }

}


// fetch todos based on which user login. fetch data via next.js api
export async function getStaticProps({ params }) {

  const id = params.id
  const { data } = await axios.get(`${todoApiWithId}${id}`)
  const user = await axios.get('http://localhost:3001/users?id=' + id)
  const currentUser = user.data[0]
  const todos = data 
  const todosIsDone = todos.filter(todo => todo.isDone === true)
  const todosIsNotDone = todos.filter(todo => todo.isDone === false)
  return { props: { 
    todosIsDone,
    todosIsNotDone,
    id,
    currentUser
    }
  }
}