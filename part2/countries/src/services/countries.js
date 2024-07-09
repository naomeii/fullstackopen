import axios from 'axios'

const getAll = () => {
    const request = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    return request.then(response => response.data)
  }

const getCountry = (name) => {
    const request = axios.get(`'https://studies.cs.helsinki.fi/restcountries/api/name/${name}'`)
    return request.then(response => response.data)
}

// const create = newObject => {
//   const request = axios.post(baseUrl, newObject)
//   return request.then(response => response.data)
// }

// const deletePerson = (id) => {
//   const request = axios.delete(`${baseUrl}/${id}`)
//   return request.then(response => response.data)
// }

// const updatePerson = (id, person) => {
//   const request = axios.put(`${baseUrl}/${id}`, person)
//   return request.then(response => response.data)
// }

export default { getAll, getCountry }
