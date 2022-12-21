const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const showAllPersons = (password) => {
  const url = `mongodb+srv://phonebook_service:${password}@cluster0.qq4x1vi.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
    .connect(url)
    .then((result) => {
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(person);
        });
        return mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
};

const addPerson = (password, name, number) => {
  const url = `mongodb+srv://phonebook_service:${password}@cluster0.qq4x1vi.mongodb.net/?retryWrites=true&w=majority`;

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: name,
        number: number,
      });

      person.save().then((res) => {
        console.log(`added ${name} ${number} to phonebook`);
        return mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
};

if (process.argv.length === 3) {
  showAllPersons(process.argv[2]);
} else if (process.argv.length === 5) {
  addPerson(process.argv[2], process.argv[3], process.argv[4]);
}
