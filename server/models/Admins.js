//imports the Schema and model objects from the "mongoose" library after installing mongoose package
const {Schema, model} = require("mongoose")

//Create a new Mongoose schema called AdminSchema using the imported Schema object. 
//A schema is a blueprint that defines the structure and properties of a MongoDB document.
const AdminSchema = new Schema({

//Define two properties within the AdminSchema: username and password. 
//Each property is an object that specifies its type, required status, and any additional validations or options.
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
  
})

//Create a Mongoose model called AdminModel using the imported model function. 
//The model represents a collection in the MongoDB database and provides an interface for interacting with it. 
//It takes two arguments: the name of the collection ("admins") and the schema (AdminSchema).
const AdminModel = model("admins", AdminSchema)

//Export the AdminModel so that it can be used in other parts of the code. 
//It allows other modules to import and use the AdminModel when interacting with the "admins" collection in the MongoDB database.
module.exports = AdminModel
