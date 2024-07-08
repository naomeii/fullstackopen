import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const baseUrl = 'http://localhost:3001/persons'

const Filter = ({ filter, setFilter }) => {
  return (
  <div>
    filter shown with: <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </div>
  );
};

const PersonForm = ({addName, newName, setNewName, newNumber, setNewNumber}) => {
  return (
  <form onSubmit={addName}>
  <div>
    name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
  </div>
  <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
  );
}

const Persons = ({showPersons, toggleDelete}) => {
  return (
    <ul>
    {showPersons.map((person, name) => (
      <li 
      key={name}> {person.name} {person.number}
      <button onClick={() => toggleDelete(person.id)}>delete</button>
      </li>
    ))}
    </ul>
  );
}


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])


  const toggleDelete = (id) => {
    personService
    .getPerson(id)
    .then(response => {
      const personName = response.name;

      if (window.confirm(`Delete ${personName} ?`)) {
        personService.deletePerson(id).then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        });
      }
    })
  };

  const addName = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name.trim() === newName.trim())) {
      if (window.confirm(`${newName} is already added to phonebook, replace?`)) {
        const currPerson = persons.find(person => person.name === newName);
        const updatedCurrPerson = { ...currPerson, number: newNumber };
        personService
        .updatePerson(updatedCurrPerson.id, updatedCurrPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person));
        });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
      })
    }
  }

  const showPersons = (filter === '')
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />

      <h2>add a new</h2>

      <PersonForm addName={addName} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />

      <h2>Numbers</h2>
      <Persons showPersons={showPersons} toggleDelete={toggleDelete} />
    </div>
  )
}

export default App