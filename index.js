const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((entry) => entry.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(400).send("no entry found");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((entry) => entry.id !== id);

  response.status(204).end();
});

const validateRequest = (entry) => {
  const response = {
    error: "",
  };

  if (!entry.name) {
    return { ...response, error: "missing entry name" };
  }

  if (!entry.number) {
    return { ...response, error: "missing entry number" };
  }

  if (persons.find((data) => data.name === entry.name)) {
    return { ...response, error: "name must be unique" };
  }

  return response;
};

const generateId = () => {
  return Math.round(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const validationResult = validateRequest(body);

  if (!(validationResult.error === "")) {
    response.status(400).json(validationResult).end();

    return;
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <br>
    <p>${new Date().toISOString()}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Application is running at ${PORT}`);
});
