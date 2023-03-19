import Axios from "axios"
import {useState, useEffect} from "react"

export default function App() {

  const api = "http://localhost:3001"


  const [users, setUsers] = useState([])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    Axios.get(`${api}/users`)
    .then(res => setUsers(res.data))
  }, [users])

  const createUser = () => {
    if (name && age && email){
    Axios.post(`${api}/createUser`, {name, age, email})
    .then(res =>  res.data)
  }
}

  return (
  <>
  {users.map(({_id, name, age, email}) => {
    return (
        <div key={_id} className="card">
    <ul>
      <li>Name: {name}</li>
      <li>Age: {age}</li>
      <li>email: {email}</li>
    </ul>
   </div>
    )
  })}

<div>
  <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
  <input type="text" placeholder="Age" onChange={e => setAge(e.target.value)} />
  <input type="text" placeholder="Email" onChange={e => setEmail(e.target.value)} />
  <button onClick={createUser}>Create User</button>
</div>

  </>
  )
}