import { useState, useEffect } from 'react'


export default function AddTodo({ userId, addMutation, showAddForm, setShowAddForm }) {


  const [form, setForm] = useState({
    title: '',
    userId: Number(userId),
    isDone: false
  })

  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      addMutation(form)
    } catch(err) {
      console.log(err)
    } finally {
      setForm({
        ...form, title: ''
      })
    }
  }
  return (
    <form 
      className={showAddForm ? '': 'is-hidden'}
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            name="title" 
            className="input" 
            type="text" 
            placeholder="Todo Title Here..." 
            value={form.title}
            onChange={(e) => handleChange(e)}
            required
          />
        </div>
      </div>
      <button className="button" type="submit">Add Todo</button>
      <button className="button" onClick={() => setShowAddForm(false)}>Cancel</button>
    </form>
  )

}