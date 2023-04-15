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
const AdminModel = require("./models/Admins")
app.post("/register", async (req, res) => {

    const {username, password} = req.body
    const admin = await AdminModel.findOne({username})
    
    admin && res.json({message: "user already exists!"})

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newAdmin = new AdminModel({username,
        password: hashedPassword
    })

    await newAdmin.save();

    return res.json({message: "Admin created successfully!"})

});

app.post("/login", async (req, res)=> {

    const {username, password} = req.body

    const admin = await AdminModel.findOne({username})
    !admin && res.json({message: "user doesn't exist!"})

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    !isPasswordValid && res.json({message: "Username or password is not correct"})

    //jwt = json web token
    const token = jwt.sign({id: admin._id}, process.env.SECRET)
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
