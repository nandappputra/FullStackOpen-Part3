const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

let persons =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/info", (request,response)=>{
    let a = new Date()
    response.write(`<p>Phonebook has info for ${persons.length} people<p>`)
    response.write(a.toUTCString())
    response.end()
})

app.get("/api/persons", (request,response)=>{
    response.json(persons)
})

app.post("/api/persons", (request,response)=>{
    let newPerson=request.body
    if (!newPerson.name || !newPerson.number){
        response.status(406).json({"error":"Incomplete data"})
    }

    else if (persons.find(person=>person.name==newPerson.name)){
        response.status(406).json({"error":"name must be unique"})
    }

    else{
        newPerson = {
            "id":Math.floor(Math.random()*100000),
            ...newPerson
        }
        persons = persons.concat(newPerson)
        console.log(persons)
        response.json(newPerson)
    }
})

app.get("/api/persons/:id", (request,response)=>{
    /*
        Returns the information of a single person
    */
    const id = request.params.id
    const person = persons.find(person => person.id==id)
    if (person){
        response.json(person)
    }

    else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request,response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id != id)
    console.log(persons)
    response.status(204).end()
})

const PORT=3001
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`)
})