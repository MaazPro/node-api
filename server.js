const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Step 1 import product model
const Product = require('./models/productModel')
const app= express();

// Middleware
app.use(express.json())
// url middleware optional
app.use(express.urlencoded({extended: false}))

// routes
// Read all product from DB
app.get('/products', async (req, res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Read single product from DB
app.get('/products/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Update product
app.put('/products/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        
        if(!product){
            return res.status(404).json({message: `cannot find product with ID ${id}`});
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// Write product to DB
app.post('/products', async (req, res)=>{
  
    try {
        // Step2
         const product = await Product.create(req.body)        
        // Step3
        res.status(200).json(product);
        } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }

})
// delete a product
app.delete('/products/:id', async (req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if(!product){
            return res.status(404).json({message: `cannot find product with ID ${id}`});
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
mongoose
.connect(MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Node API app is running on port ${PORT}`)
    })
    console.log("connected to MongoDB")
})
.catch((error)=>{
    console.log(error)
})