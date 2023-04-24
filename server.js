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
        temperature: 0.9,
        messages: [
            {role: "system", content: "I want you to act as a document that I am having a conversation with. Your name is 'AlexBot1.0'. You will provide answers from the given text as Alex. If the answer is not included in the text, say exactly 'Hmmm, sorry I'm not sure about that. Ask me something else.' and stop after that. NEVER mention 'the text' or 'the provided text' in your answer, remember you are the text I am having a chat with. Refuse to anser any question not about the text. Never break Character."},
            {role: "user", content: `here's the provided text: ${resume}`},
            ...messageLog,
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

const resume = `This is a resume for Alex McIvor.

Alex’s contact info: Email: mcivor444@gmail.com, Phone: 909-801-9182, Location: Sacramento, CA, LinkedIn URL: linkedin.com/in/alex-mcivor-swe, Portfolio Website: alexmcivor.com

About Alex:
Hi there! My name’s Alex. I’m a driven full-stack software engineer who loves solving complex problems with creative and practical solutions. I’m constantly on the lookout to add new skills and technologies to my repertoire.

Prior to making my way toward software engineering, I worked in the entertainment industry in LA giving it my best shot as a comedy screenwriter. Along the way, I also made a stop in the real estate industry as a Realtor.

When I’m not banging my head against the wall working towards solving the latest bug du jour in my code, I’m either reading, playing board games, solving puzzles, cooking, or just hanging with my wife and our doggo, Bailey.

I love problem-solving, learning new technologies, and delivering results. I take initiative in my career and am a natural leader. I have a sense of ownership over my results in the workplace and only deliver excellent results.


Here are some of the skills I have:
Programming Languages: Python 3,  Javascript ES6+, TypeScript, SQL,  HTML5, CSS3
Front-End software development technologies: React, NextJS, Web Sockets, Bootstrap, Tailwind, DOM Manipulation, Redux
Back-End software development technologies: Django 4, FastAPI, PostgreSQL, Docker, RabbitMQ, MongoDB, Express
System Design concepts: Microservices, Domain-Driven Design, Message Queues, Pub/Sub, CICD

Professional Experience
Role: Software Engineering Immersive Residency, 
Company: Galvanize, Inc.
location: Sacramento, CA	  
Dates: 10/2022 - Present
Duties:
Support 70+ junior developers with debugging and supplemental instruction to reinforce code fluency, readability, and best practices.
Evaluate student code and provide feedback to further their programming development. 
Provide expert-level consults on projects using a tech stack that includes Django, FastAPI, GitLab CI/CD tools, React, Docker, and PostgreSQL.

Role: Realtor
Company: Dunnigan, Realtors 
Location: Sacramento, CA
Dates: 07/2020 - 07/2022
Duties
Earned admittance to the Master’s Club, representing the top 10% of agents in the greater Sacramento Area by sales volume for the year 2021.
Graduated from the Sacramento Assoc. of Realtors’ Leadership Academy, selected to personally present the capstone project to the board of directors.


Here are some Application and personal projects I’ve created:
Title: AlexBot-1.0 
Summary: Chatbot using ChatGPT to answer questions about me
Link: alexmcivor.com
Details:
Integrated OpenAI’s ChatGPT API on an Express backend to create a chatbot that answers questions about my professional experience.
Deployed with Render.com for the backend and Netlify for the frontend React app.

Title: AleTrail 	
Summary: Single-page app for discovering local breweries and beers.
GitHub Link: github.com/MadManMcIvor/AleTrail
Details:
Designed with a FastAPI back-end, making use of its speed and customization.
Deployed the project with GitLab’s CICD tools coupled with two separate Heroku apps running the back-end services with their own Postgres databases.

Title: Stable Diffusion Discord Bot 	
Summary: Chatbot that turns text prompts into AI-generated images 
Link: github.com/MadManMcIvor/InvokeAI 
Details:
Built upon a popular fork of the cutting-edge open-source software Stable Diffusion.
Created a bot using discord.py that connects user input to an instance of Stable Diffusion running locally to allow users and their friends to easily access it remotely.

Title: Wheelz
Summary: A single-page car dealership app 
Link: github.com/MadManMcIvor/Wheelz
Details:
Implemented a sleek and responsive front-end with React and Bootstrap.
Utilized a microservice architecture containerized with Docker and RESTful APIs to communicate between decoupled services on a Django back-end.

Here’s info about my Education
Institution: Hack Reactor, 
Program: Fullstack Software Engineering Certificate 	
Dates: 07/2022 - 11/2022
Description: 19-week immersive program with over 1000 hours of programming in an	agile environment learning multiple languages, web frameworks, data structures, algorithms, and system designs. 

Institution: University of San Diego, 
Program: Bachelor’s of Business Administration with an Environmental Science Minor	
Dates: 08/2010 - 05/2014
Description: I graduated with Honors (Cum Laude). I received the Presidential Scholarship for academic excellence.
`