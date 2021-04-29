export default function EditTodo({ populate, setPopulate, editMutation, showEditForm, setShowEditForm }) {

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      editMutation(populate)
    } catch(err) {
      console.log(err)
    } finally {
      setPopulate({})
    }
  }

  return (
    <form 
      className={showEditForm ? '' : 'is-hidden'}
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            name="title" 
            className="input" 
            type="text"
            value={populate.title ? populate.title : ''} 
            placeholder="Todo Title Here..." 
            onChange={(e) => setPopulate({ ...populate, title: e.target.value})}
            required
          />
        </div>
      </div>
      <button className="button" type="submit">Edit Todo</button>
      <button className="button" onClick={() => setShowEditForm(false)}>Cancel</button>
    </form>
  )

}