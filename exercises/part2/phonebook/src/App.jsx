import { useState } from 'react'

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

const Persons = ({showPersons}) => {
  return (
    <ul>
    {showPersons.map((person, name) => (
      <li key={name}>{person.name} {person.number}</li>
    ))}
    </ul>
  );
}



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');


  const addName = (event) => {
    event.preventDefault();
    
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons([...persons, { name: newName, number: newNumber }]);
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
      <Persons showPersons={showPersons} />
    </div>
  )
}

export default App