//create server
const express = require("express")
const app = express()
const _PORT = process.env.PORT;
const cors = require("cors")
app.use(cors())
app.use(express.json())

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//connect to db
const username = process.env.USERNAME,
      password = process.env.PASSWORD,
      database = process.env.DB;

const mongoose = require("mongoose")

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ay354g7.mongodb.net/${database}?retryWrites=true&w=majority`)
// password: 4ZIChUZBmH4RxxFE

// user model
const UserModel = require("./models/Users")

//get request
app.get("/users", async (req, res)=> {
    const users = await UserModel.find()
    res.json(users)
})

//post request to create user
app.post("/createUser", async (req, res)=> {
    const newUser = new UserModel(req.body);
    await newUser.save();

   res.json(req.body)
})

app.listen(_PORT, () => {
    console.log("server works")
})

// admin model

//Import AdminModel from the "./models/Admins" file
const AdminModel = require("./models/Admins")

//Set up a route handler for the HTTP POST request to "/register" endpoint. 
//Defines an asynchronous callback function with req and res parameters to handle the request and response.
app.post("/register", async (req, res) => {

    //Use destructuring assignment to extract the username and password properties from the request body (req.body). 
    //The request body is an object containing these properties.
    const {username, password} = req.body
    
    //Use the AdminModel (Mongoose model) to query the database and find a document that matches the provided username. 
    //It uses the findOne method, which returns a promise.
    const admin = await AdminModel.findOne({username})
    
    //Check if the admin variable is truthy (a document was found with the given username). 
    //If it is truthy, it sends a JSON response to the client with a message stating that the user already exists. 
    //The res.json() method converts the provided object into a JSON string and sends it as the response.
    admin && res.json({message: "user already exists!"})

    //Here I used the bcrypt library to hash the provided password synchronously. 
    //It uses a salt factor of 10 for hashing, which determines the computational cost of the hashing process.
    const hashedPassword = bcrypt.hashSync(password, 10)

    //Create a new instance of the AdminModel using the new keyword and assigns it to the newAdmin variable. 
    //It passes an object with username and password properties, where the password is set to the hashed password generated in the previous line.
    const newAdmin = new AdminModel({username,
        password: hashedPassword
    })

    //Save the new admin object to the database by calling the save() method on the newAdmin instance. 
    //It returns a promise, so await is used to wait for the save operation to complete.
    await newAdmin.save();

    //Send a JSON response to the client with a message indicating that the admin was created successfully. 
    //The return statement ensures that the function execution ends at this point, preventing any further code execution in the callback.
    return res.json({message: "Admin created successfully!"})

});

//Set up a route handler for the HTTP POST request to the "/login" endpoint. 
//It defines an asynchronous callback function with req and res parameters to handle the request and response.
app.post("/login", async (req, res)=> {

    //Use destructuring assignment to extract the username and password properties from the request body (req.body). 
    //The request body is an object containing these properties.
    const {username, password} = req.body

    //Use the AdminModel (Mongoose model) to query the database and find a document that matches the provided username. 
    //It uses the findOne method, which returns a promise. The await keyword is used to wait for the promise to resolve, 
    //and the result is assigned to the admin variable.
    const admin = await AdminModel.findOne({username})

    //This line checks if the admin variable is falsy (no document was found with the given username). 
    //If it is falsy, it sends a JSON response to the client with a message stating that the user doesn't exist. 
    //The res.json() method converts the provided object into a JSON string and sends it as the response.
    !admin && res.json({message: "user doesn't exist!"})

    //Use the bcrypt library to compare the provided password with the hashed password stored in the admin document retrieved from the database. It returns a promise, 
    //and await is used to wait for the comparison to complete. The result is assigned to the isPasswordValid variable.
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    //Check if the isPasswordValid variable is falsy (the password provided by the user does not match the stored hashed password). 
    //If it is falsy, it sends a JSON response to the client with a message stating that the username or password is not correct.
    !isPasswordValid && res.json({message: "Username or password is not correct"})

    //jwt = json web token
    //Use the jwt library (JSON Web Token) to create a token. It signs a payload object containing the id property with the value of admin._id, 
    //which represents the unique identifier of the admin retrieved from the database. 
    //The token is generated using a secret key stored in the process.env.SECRET environment variable.
    const token = jwt.sign({id: admin._id}, process.env.SECRET)

    //Send a JSON response to the client with the generated token and the adminID extracted from the admin object. 
    //The return statement ensures that the function execution ends at this point, preventing any further code execution in the callback.
    return res.json({token, adminID: admin._id})
})



//part 1 --register a user and log in authintication--
//Create admin model that contains username and password
//import AdminModel to the server
//make a post request to register an admin and to simulate post request and make sure it's working, use postman to show the register request as json
//to avoid duplication, add a check with a message to alert that admin user is already exists

//part 2 --register a user in the database--
//Create a new admin user that takes the same data structure from the AdminModel and save it in the database then add a message to confirm adding the user

//part 3 --password hashing--
//install bcrypt package
//use the bcrypt package in a variable and add hashSync method to it with 2 parameters which are password variable and number 10 how many times to hash the password

//part 4 --Logging in--
//Create post request for the login that contains username and password and add it to postman to test it
//Add a check and a message to make sure if the user doesnt exist
//Add a check for the password if it's correct or not by comparing it with the hashed password in the database using compare method from bcrypt package, the method takes 2 parameters the password variable and the found admin with its password

//part 6 --log in verification using Token--
//Install jwt package "json web token" and import it
//Using the package in a variable which could be "token", add sign method from jwt and it takes 2 parameters json object contains the admin id and a secret keyword
//Return the result as json that takes json object parameter that contains the variable token and the admin id
//Simulate that in the postman by sending an existing user and in the console you will get thr admin identifier and the token

//part 7 --creating log ing form with react--
