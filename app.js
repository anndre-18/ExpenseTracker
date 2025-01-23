const express=require('express')
const mongoose=require("mongoose")
const app=express()
app.use(express.json)
const { v4 : uuidv4 } = require ('uuid');


//returns a promise
//conn establish => promise resolves else throws error
mongoose.connect("mongodb+srv://anndre-18:<sherrlyn_31>@cluster0.5afem.mongodb.net/expenses").then(()=>{
    console.log("Connected to MongoDB")
}) 

const expenseSchema = new mongoose.Schema({
    id:{type:String , required:true},
    title:{type:String , required:true},
    amount:{type:Number , required:true},
})

const Expenses =mongoose.model("Expense",expenseSchema)


//to get one data
app.get("/api/expenses/:id",async(req,res)=>{
    try{
    const {id} = req.params;
    const expenses = await Expense.findOne({id:id});
    if(!expenses){
        res.status(404).send({message: "No expenses found"});
        return;

    }
    res.status(200).json(expenses);
    }catch (error){
        res.status(500).json({})
    }
    });


app.post('/api/expenses',async (req,res)=>{  // same Router for get and post => '/api/expenses'
    const {title,amount}= req.body;
    if(!title || !amount){
        res.status(400).json({message : "Please provide both title and amount"})
    }

    const newExpense = new Expense ({
        id:uuidv4(),
        title:title,
        amount:amount
    })
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense)
    res.end()
});


app.put('/api/expenses', async (req, res) => {
    try {
        const { id, title, amount } = req.body; 
        if (!id || !title || !amount) {
            return res.status(400).json({ message: "Please provide id, title, and amount" });
        }
        const updatedExpense = await Expense.findOneAndUpdate(
            { id: id }, 
            { title: title, amount: amount }, 
            { new: true } 
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the expense" });
    }
});

app.delete("/api/expenses/:id",async(req,res)=>{
    const {id} = req.params;
    try{
        const deletedExpense = await Expense.findOneAndDelete({id:id})
        if(!deletedExpense){
            res.status(404).json({message:"Expense not found"})
            return
        }
        res.status(200).json({message:"Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});


app.listen(3000,()=>{
    console.log("server is running");
});