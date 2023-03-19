//create server
const express = require("express")
const app = express()
const _PORT = process.env.PORT;
const cors = require("cors")
app.use(cors())
app.use(express.json())


//connect to db
const username = process.env.USERNAME,
      password = process.env.PASSWORD,
      database = process.env.DB;

const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ay354g7.mongodb.net/${database}?retryWrites=true&w=majority`)
// password: vMYrfDk9jC7Q4Ahj

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

