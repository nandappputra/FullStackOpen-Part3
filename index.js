require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

morgan.token("request-content", (request, response) => {
  const stringified = JSON.stringify(request.body);
  return stringified === "{}" ? "" : JSON.stringify(request.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :request-content"
  )
);

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
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

  return response;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const validationResult = validateRequest(body);

  if (!(validationResult.error === "")) {
    return response.status(400).json(validationResult).end();
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <br>
    <p>${new Date().toISOString()}</p>`);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Application is running at ${PORT}`);
});
