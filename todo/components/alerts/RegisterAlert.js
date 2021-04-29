
export default function RegisterAlert({ afterRegister, message, error, inErrorCondition }) {

  const focused = 'button is-small is-focused'

  return (
    <div className="notification is-flex is-align-items-center is-justify-content-space-around has-background-link">
      <p className="is-size-7">{message}</p>
      <button className={focused} autoFocus={true} onClick={error ? inErrorCondition : afterRegister}>OK</button>
    </div>
    
  )
}