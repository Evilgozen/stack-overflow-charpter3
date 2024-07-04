const express = require('express')
const app = express()


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298A",
    important: true
  }
]


let phones = 
[
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

app.get('/api/info',(request,response)=> {
  const num=phones.length
  const datetime=new Date()
  let info=`Phonebook has info for ${num} people \n ${datetime}`
  console.log(info)
  response.send(info)
})

app.use(express.json())

app.post('/api/persons',(request,response)=> {
  const body=request.body
  console.log(body)

  let flag=false
  if(body.name) {
    flag=phones.some(phone => phone.name===body.name)
  }
  
  if(!body.name || !body.number || flag) {
    return response.status(400).json({
      error:'name must be unique'
    })
  }

  const newPhone = {
    id:Math.random(),
    name:body.name,
    number:body.number
  }

  console.log(newPhone)

  phones=phones.concat(newPhone)

  response.json(newPhone)

})

app.delete('/api/phones/:id',(request,response)=> {
  const id=Number(request.params.id)
  phones=phones.filter(phone => phone.id!==id)

  console.log(id,phones)

  response.status(204).end()
})

app.get('/api/phones',(request,response) => {
  response.json(phones)
})

app.get('/api/phones/:id',(request,response) => {
  const id=Number(request.params.id)
  const phone=phones.find(phone=>phone.id===id)

  if(phone) {
    response.json(phone)
  }else {
    response.status(404).end()
  }
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })
  
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
  
  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id',(request,response) => {
    const id =Number(request.params.id)
    notes=notes.filter(note=>note.id!==id)

    response.status(204).end()
  })

  app.use(express.json())

  const generateId=()=> {
    const maxId=notes.length>0 
      ? Math.max(...notes.map(n=>n.id))
      :0
    return maxId +1
  }

  app.post('/api/notes',(request,response) => {
    const body = request.body
    
    if(!body.content) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    const note ={ 
      content: body.content,
      important: body.important|| false,
      date:new Date(),
      id:generateId(),
    }

    notes=notes.concat(note)

    response.json(note)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })