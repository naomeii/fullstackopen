import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowCountry = ({currCountryObj, weatherObj}) => {
  if (!weatherObj) {
    // hasn't finished rendering
    return null;
  }
  
  const temp = ((weatherObj.main.temp) - 273.15).toFixed(2);
  const icon = weatherObj.weather[0].icon;
  const desc = weatherObj.weather[0].description;
  const windSpeed = weatherObj.wind.speed;

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
      <h1>Weather in {currCountryObj.capital}</h1>
      <p>
        temperature {`${temp} celsius`}
      </p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} />
      <p>
        wind {`${windSpeed} m/s`}
      </p>
    </>
  )
}


function App() {
  const api_key = import.meta.env.VITE_SOME_KEY
  const [searchValue, setSearchValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);
  const [weatherObj, setWeatherObj] = useState(null);

  const handleChange = (event) => {
    setSearchValue(event.target.value)
    setCountrySelected(null); 

    setFilteredCountries(
      countries.filter(country => country.name.common.toLowerCase().includes(event.target.value))
    );
  }

  const displayResults = () => {
    if (filteredCountries || countrySelected){
      if (countrySelected) {
        return <ShowCountry currCountryObj={countrySelected} weatherObj={weatherObj}/>;
      }
      if (filteredCountries.length === 1){
        return <ShowCountry currCountryObj={filteredCountries[0]} weatherObj={weatherObj}/>
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
    .then(returnedCountries => setCountries(returnedCountries.data))
  }, [])

  // fetch weather data
  useEffect(() =>
    {
      if (filteredCountries.length == 1 || countrySelected) {
        const currCountryObj = filteredCountries[0] || countrySelected
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${currCountryObj.capital},${currCountryObj.cca2}&appid=${api_key}`)
        .then(returnedWeather => setWeatherObj(returnedWeather.data))
        .catch(error => 
          console.log(`${error} No capital was found`)
        )
      }
    }, [filteredCountries]
  )  

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
