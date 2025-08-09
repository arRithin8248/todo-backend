const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL }));

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
//sample in memory storage
//as connecting mongodb we dont need this variable anymore
//let todos=[];
//creating schema
const todolistSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String
    },
    description: String
})

//creating model
 
const todolistModel= new mongoose.model('ToDo',todolistSchema);

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-proj1')
.then(() => {
        console.log('DataBase Connected')
})
.catch((err) => {
    console.log(err)
})


//create a new todo item 
app.post('/todos',async (req, res)=>{
    const{title,description}=req.body;

//instead of storing in variable we are going to store in the database
    try{
    const newTodo= new todolistModel({title,description})
    await newTodo.save();
    res.status(201).json(newTodo);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})
//to Get all items
app.get('/todos',async (req, res)=>{
    try {
        const todos=await todolistModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//updating todo items

app.put("/todos/:id", async (req, res)=>{
    try {
        const{title,description}=req.body;
    const id= req.params.id;
    const updatedToDo= await todolistModel.findByIdAndUpdate(
        id,
        {title,description},
        {new : true}
    )
    if(!updatedToDo){
        return res.status(404).json({message:"ToDo not found"})
    }
    res.json(updatedToDo)

    }catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

//deleting an item

app.delete("/todos/:id",async(req, res)=>{
    try {
        const id=req.params.id;
    await todolistModel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));