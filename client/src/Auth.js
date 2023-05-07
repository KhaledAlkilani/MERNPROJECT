import {useState} from "react"
// import { useNavigate } from "react-router-dom";
import {Container, Form, Button} from "react-bootstrap"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import Axios from "axios"
import {useCookies} from "react-cookie"

export default function Auth() { 
    const [cookies, setCookies] = useCookies("access_token")

    const removeCookies = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("adminID")
        window.location.reload(false)
    }

    return (
        <>
          {
             cookies.access_token
             ? 
             <Button variant="danger" onClick={removeCookies}>Logout</Button>
             : (
                <>
            <div className="bg-dark mb-5 w-100">
                <Register />
           </div>
           <div className="bg-dark w-100">
                <Login/>
            </div>
           </>
             )
          }
           </>         
    )
}

const Register = () => {
    const api = "http://localhost:3001/register"

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        await Axios.post(`${api}`, {
            username, password
        })
        alert("Admin user created")
    }

    return (
        <AuthForm 
        label="Register"
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        />
    )
}

const Login = () => {
    const api = "http://localhost:3001/login"

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

//Use the useCookies hook from a cookies library (such as react-cookie or universal-cookie). 
//It declares a state variable setCookies that allows setting cookies in the browser. 
//The access_token is the name of the cookie.
    const [_, setCookies] = useCookies(["access_token"])

    const onSubmit = async (e) => {
//This function prevents the default form submission behavior
        e.preventDefault()

//a POST request being sent to the login API endpoint with the provided username and password as the request payload. 
//It uses the Axios library to make the HTTP request. The response from the server is stored in the response variable.
        const response = await Axios.post(`${api}`, {
            username, password
        })
//Set the "access_token" cookie in the browser with the value obtained from the response data. It uses the setCookies function from the cookies library.
        setCookies("access_token", response.data.token)

//Set an item called "userID" in the browser's localStorage with the value obtained from the response data. It stores the admin's ID for future reference.
        window.localStorage.setItem("userID", response.data.adminID)
//This line reloads the current page, forcing a full refresh of the page. The argument false indicates that the page should be reloaded from the cache 
//rather than making a fresh request to the server.
        window.location.reload(false)
    }

    return (
        <AuthForm 
        label="Log in"
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        />
    )
}

const AuthForm = ({label, username, setUsername, password, setPassword, onSubmit}) => {
 return (
    <Container className="d-flex">
        <Form className="form" onSubmit={onSubmit}>
            <h2 className="text-white">{label}</h2>
            <Form.Control placeholder="Name"             
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                />
                <Form.Control
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                <Button variant="success" type="submit">{label}</Button>
        </Form>
    </Container>
 )
}
