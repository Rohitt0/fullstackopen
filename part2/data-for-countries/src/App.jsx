import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const matchingCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!selectedCountry) {
      return
    }

    const capital = selectedCountry.capital[0]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(() => {
        setWeather(null)
      })
  }, [selectedCountry, apiKey])

  const handleSearch = event => {
    setSearch(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  const showCountry = country => {
    setSelectedCountry(country)
    setSearch(country.name.common)
  }

  return (
    <div>
      <div>
        find countries
        <input
          value={search}
          onChange={handleSearch}
        />
      </div>

      {selectedCountry ? (
        <Country
          country={selectedCountry}
          weather={weather}
        />
      ) : matchingCountries.length > 10 ? (
        <p>
          Too many matches, specify another filter
        </p>
      ) : matchingCountries.length === 1 ? (
        <Country
          country={matchingCountries[0]}
          weather={weather}
        />
      ) : (
        matchingCountries.map(country => (
          <div key={country.cca3}>
            {country.name.common}

            <button
              onClick={() => showCountry(country)}
            >
              Show
            </button>
          </div>
        ))
      )}
    </div>
  )
}

const Country = ({ country, weather }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>
        Capital {country.capital[0]}
        <br />
        Area {country.area}
      </p>

      <h2>Languages</h2>

      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>
            {language}
          </li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      {weather && (
        <div>
          <h2>
            Weather in {country.capital[0]}
          </h2>

          <p>
            Temperature {weather.main.temp} Celsius
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p>
            Wind {weather.wind.speed} m/s
          </p>
        </div>
      )}
    </div>
  )
}

export default App