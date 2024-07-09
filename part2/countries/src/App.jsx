import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowCountry = ({currCountryObj}) => {
  return (
    <>
      <h1> {currCountryObj.name.common} </h1>
      <p>
      capital {currCountryObj.capital} <br />
      area {currCountryObj.area}
      </p>
      <h3>languages:</h3>
      <ul>

      {
      // since currCountryObj.languages = {"fra": french, "": }
      // Object.entries(currCountryObj.languages) = [french,...]
      Object.entries(currCountryObj.languages).map(([key, value]) => (
        <li key={key}>
          {value}
        </li>
      ))}
      </ul>
      <img src={currCountryObj.flags.png} alt={currCountryObj.flags.alt} width='150'/>
    </>
  )
}

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);


  const handleChange = (event) => {
    setSearchValue(event.target.value)
    setCountrySelected(null); 

    setFilteredCountries(
      countries.filter(country => country.name.common.toLowerCase().includes(event.target.value))
    );
  }

  const displayResults = () => {
    if (filteredCountries){
      if (countrySelected) {
        return <ShowCountry currCountryObj={countrySelected} />;
      }
      if (filteredCountries.length === 1){
        return <ShowCountry currCountryObj={filteredCountries[0]}/>
      } 
      else if (filteredCountries.length > 10){
        return <>Too many matches, specify another filter</>
      } 
      else if (filteredCountries.length <= 10 && filteredCountries.length > 0) {
        return (
          <ul>
            {filteredCountries.map(country => 
            <li key={country.name.common}>
              {country.name.common} <button name={country.name.common} type='button' onClick={() => setCountrySelected(country)}>show</button>
            </li>          
          )}
          </ul>
        )
      }
    }
  }

  const onSearch = (event) => {
    event.preventDefault();
  }

  // gets all country objects and puts in countries
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(returnedCountries => 
      {
        setCountries(returnedCountries.data);
      })
  }, [])
  

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries  <input type="text" value={searchValue} onChange={handleChange} />
      </form>
      {displayResults()}

    </div>
  )
}

export default App
