// Task1: initiate app and run server at 3000

const express = require('express');
const app = new express();

const morgan = require('morgan');
app.use(morgan('dev'));


const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;


const {json} = require('body-parser');
const bodyParser = require('body-parser');



app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})

const path=require('path');

app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

app.use('/api/employeelist',express.urlencoded({extended:true}));

// Task2: create mongoDB connection 

const mongoose = require('mongoose');
mongoose.connect(
    process.env.mongoDB_URL,
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const Schema = mongoose.Schema({
    name : String,
    position : String,
    location : String,
    salary : Number
});
const employeeData = mongoose.model('employee',Schema);


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'


app.get('/api/employeelist', async (req, res) => {
    try {
        const data = await employeeData.find();
        res.send(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});





//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await employeeData.findById(id);
        if (!data) {
            return res.status(404).send('Employee not found');
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send('Server Error');
        console.error(error);
    }
});







//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist',  bodyParser.json(), async (req, res) => {
    try {
      const { name, position, location, salary } = req.body;
      const data = new employeeData({
        name: name,
        position: position,
        location: location,
        salary: salary
      });
      const savedEmployee = await data.save();
      res.status(201).json(savedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });





//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete("/api/employeelist/:id", async (req, res) => {
    try {
      const deletedEmployee = await employeeData.findByIdAndDelete(req.params.id);
      if (!deletedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });






//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put("/api/employeelist", bodyParser.json(), async (req, res) => {
    try {
      const { name, location, position, salary } = req.body;
      const salaryNumber = parseFloat(salary);
  
      const updatedEmployee = await employeeData.findOneAndUpdate(
        { name: name },
        { location, position, salary: salaryNumber },
        { new: true }
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(updatedEmployee);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: "Internal server error" });
    }
  });



//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



