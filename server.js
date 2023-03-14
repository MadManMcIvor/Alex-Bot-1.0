const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 8000
var cors = require('cors')


const { Configuration, OpenAIApi } = require("openai");

 // const getTimeStamp = () => {
    //     const date = new Date()
    //     return(date.toLocaleTimeString())
    // }

const callChatGPT = async (text, messageLog) => { 
    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });
    const openai = new OpenAIApi(configuration);
      
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.2,
        messages: [
            {role: "system", content: "You are a helpful assistant answering questions about this person from this resume: https://docs.google.com/document/d/1MlQVs8xzh7FFM4Kday8sr6_OQRpxsI606l2-9DKNnmw/edit?usp=sharing"}, ...messageLog,
            {role: "user", content: text}
        ],
      });
    console.log(completion.data.choices[0].message);
    return(completion.data.choices[0].message);
}


const app = express()
app.use(cors())
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
    console.log(req.body.message, req.body.messageLog)
    const message = req.body.message
    const messageLog = req.body.messageLog
    const chatResponse = await callChatGPT(message, messageLog)
    if(chatResponse) {
        res.status(200).json({content: chatResponse.content})
    }
})

app.listen(port, () => console.log(`Hello, listening on ${port}`))