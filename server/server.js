//create server
const express = require("express")
const app = express()

//connect to db
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://khaledalkilani:XzrM5imQGk3Nsy1K@cluster0.ay354g7.mongodb.net/mernproject?retryWrites=true&w=majority")
// password: XzrM5imQGk3Nsy1K

// import user model
const UserModel = require("./models/Users")

app.get("/users", async (req, res)=> {
    const users = await UserModel.find()
    res.json(users)
})

app.listen("3001", () => {
    console.log("server works good")
})

