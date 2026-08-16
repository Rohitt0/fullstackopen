import { useEffect, useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showMessage = message => {
    setMessage(message)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const showError = message => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmReplace) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id === existingPerson.id
                ? response.data
                : person
            )
          )

          showMessage(
            `Updated ${newName}`
          )

          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          showError(
            `Information of ${newName} has already been removed from server`
          )
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))

        showMessage(
          `Added ${newName}`
        )

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showError('Failed to add person')
      })
  }

  const deletePerson = person => {
    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (!confirmDelete) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(
          persons.filter(p => p.id !== person.id)
        )

        showMessage(
          `Deleted ${person.name}`
        )
      })
      .catch(error => {
        showError(
          `Information of ${person.name} has already been removed from server`
        )
      })
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      {message && (
        <div className="success">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="error">
          {errorMessage}
        </div>
      )}

      <Filter
        filter={filter}
        onChange={handleFilterChange}
      />

      <h3>add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />
    </div>
  )
}

export default App