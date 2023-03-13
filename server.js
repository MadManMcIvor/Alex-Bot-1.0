const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (reg,res) =>{
    res.status(200).json({message: "Hello"})
})

app.post('/', async (req, res) => {
    console.log(req.body)
    if(!req.body.message) {
        res.status(400)
        throw new Error('Something was missing on this request')
    }
 
    res.status(200).json({message: "Hello"})
})

app.listen(port, () => console.log(`Hello, listening on ${port}`))