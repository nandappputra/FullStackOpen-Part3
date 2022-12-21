require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
const { response } = require("express");

morgan.token("request-content", (request, response) => {
  const stringified = JSON.stringify(request.body);
  return stringified === "{}" ? "" : JSON.stringify(request.body);
});

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :request-content"
);

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.find({ _id: id })
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(400).send("no entry found");
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.updateOne({ _id: id }, { number: request.body.number })
    .then((result) => {
      const updatedPerson = new Person({
        id: id,
        name: request.body.name,
        number: request.body.number,
      });
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.deleteOne({ _id: id })
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
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

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const validationResult = validateRequest(body);

  if (!(validationResult.error === "")) {
    return response.status(400).json(validationResult).end();
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (request, response, next) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <br>
    <p>${new Date().toISOString()}</p>`);
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Application is running at ${PORT}`);
});
