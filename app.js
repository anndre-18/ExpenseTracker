const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { v4 : uuidv4 } = require('uuid') ;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cors = require("cors")
const authMiddleware = require("./auth");


app.use(express.json());//express middleware for POST method
app.use(cors()) //to handle the cors error

//connect backend with database
// mongoose.connect("mongodb+srv://anndre-18:sherrlyn31@cluster0.5afem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")//returns a promise
// .then(()=>{
//     console.log("Connected to MongoDB")
// })


mongoose
  .connect("mongodb://localhost:27017/expenses") //returns a promise
  .then(() => {
    console.log("Connected to MongoDB");
  });

const userSchema= new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    uname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}

})
const User = mongoose.model("User",userSchema)

//creating a schema for DB
const expenseSchema = new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true},
});
//creating a model for Expense
const Expense = mongoose.model("Expense",expenseSchema);

//GET method - to get all data
app.get("/api/expenses",async(req,res)=>{
    console.log(req.user)
    try{
        //await ensures that find operation is executed completely
        const expenses = await Expense.find();
        if(!expenses){
            res.status(404).send({message: "No expenses found"});
        }
        res.status(200).json(expenses);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});

//to get one data
app.get("/api/expenses/:id", authMiddleware, async(req,res)=>{
    const {id} = req.params;
    try{

        const expenses = await Expense.findOne({id:id});
    if(!expenses){
        res.status(404).send({message: "No expenses found"});
        return;
    }
    res.status(200).json(expenses);
}
catch(error){
    res.status(500).json({message:"Internal server error"});}
  });
    

// const expenses = [
//   {
//     id: 1,
//     title: "Food",
//     amount: 200,
//   },
//   {
//     id: 2,
//     title: "Recharge",
//     amount: 500,
//   },
// ];

// app.get('/api/expenses' , (req,res)=>{
//     res.status(200).json(expenses);
// });

// app.get("/api/expenses", (req, res) => {
//   console.log(req.query);
//   res.status(200).json(expenses);
// });

// // get - parameter(used for getting single data,only one data is sent) -> '/:' , query(to get multiple data,multiple data is sent)-> '?'
// app.get("/api/expenses/:id", (req, res) => {
//   const { id } = req.params; //destructuring
//   // console.log(id)
//   const expense = expenses.find((expense) => expense.id == id);
//   if (!expense) {
//     res.status(404).json({ message: "Not found" });
//     return;
//   }
//   res.status(200).json(expense);
// });



// POST METHOD
app.post("/api/expenses", async(req, res) => {
//   console.log(req.body); //request must be parsed for which we use middleware -> parse the data which comes from the client and then it is sent to the server
const {title,amount} = req.body;
try{
    if(!title || !amount){
        res.status(400).json({message:"please provide both title and amount"});
    }
    
    const newExpense = new Expense({
        id:uuidv4(),
        title:title, //if both key and value are same give only once (title)
        amount
    })
      const savedExpense = await newExpense.save()
      res.status(201).json(savedExpense);
    //   res.end();

}
catch(error){
    res.status(500).json({message:"Internal server error"});
}

});

//Delete
app.delete("/api/expenses/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedExpense = await Expense.findOneAndDelete({id:id})
    
        if(!deletedExpense){
            res.status(404).json({message:"Expense not found"})
            return
        }
        console.log(deletedExpense);
        res.status(200).json({message:"Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});


// PUT Route using findOneAndUpdate
app.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params; 
    const { title, amount } = req.body; 
  
    try {
      const updatedExpense = await Expense.findOneAndUpdate(
        { id: id }, 
        { title, amount }, 
        { new:true} 
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.status(200).json(updatedExpense); 
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });


app.post("/register",async(req,res)=>{
    const { email ,uname, password}=req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            res.status(400).json({message:"email alresdy exist"})
            return
        }
        const hashedPassword = await bcrypt.hash(password ,10)
        const newUser = new User({
            id: uuidv4(),
            email,uname,
            password: hashedPassword
        })
        await newUser.save()
        res.status(200).json({message:"User created success"})
    }
    catch(error){
        res.status(500).json({message:"Internal Server error"})
    }
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const existingUser= await User.findOne({email});
       if(!existingUser){
        return res.status(400).json({message:"Invalid email"})
       }
       const validPassword = await bcrypt.compare(password , existingUser.password)
       if(!validPassword){
        return res.status(400).json({message:"Invalid Password"})
       }
       const token = jwt.sign({id: existingUser.id},"my_secret",{expiresIn : '1h'})
       res.status(200).json({token})
       
    } catch (error) {
        res.status(500).json({message:"Internal Server error"})
        
    }
})
app.listen(3000, () => {
  console.log("server is running");
});
