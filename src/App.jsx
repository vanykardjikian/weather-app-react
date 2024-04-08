import './App.css'
import SearchBar from './components/SearchBar/SearchBar'
import WeatherCard from './components/CurrentWeatherCard.jsx'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'

const API_KEY = '75b36898c1284f41a32114039240704'
const citySuggestionsURL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`
const getCurrentWeatherURL = (coord) => {
	return `https://api.weatherapi.com/v1/forecast.json?key=75b36898c1284f41a32114039240704&q=${coord}&days=3&aqi=no&alerts=no`
}
const App = () => {


	const [city, setCity] = useState('')
	const [citySuggestions, setCitySuggestions] = useState([])
	const [currentWeather, setCurrentWeather] = useState(null)
	const [forecastWeather, setForecastWeather] = useState(null)

	useEffect(() => {
		const fetchDataAfterTimeout = setTimeout(() => {
			const fetchCitySuggestions = async () => {
				const res = await fetch(citySuggestionsURL + city)
				const data = await res.json();
				const cityData = data.map(suggestion => {
					return {
						cityName: suggestion.name,
						cityDetails: suggestion.region.length !== 0 ?
							`${suggestion.region}, ${suggestion.country}` : suggestion.country,
						cityCoord: `${suggestion.lat},${suggestion.lon}`
					}
				})
				console.log(cityData)
				setCitySuggestions(cityData)
			}
			if (city.length > 2) {
				fetchCitySuggestions()
			} else {
				setCitySuggestions([])
			}
		}, 600)

		return () => clearTimeout(fetchDataAfterTimeout)
	}, [city])





	const handleCityChange = (newCity) => {
		setCity(newCity)
	}

	const handleCityClick = async (selectedCity) => {
		const res = await fetch(getCurrentWeatherURL(selectedCity.cityCoord))
		const data = await res.json()
		setCitySuggestions([])
		setCity('')
		const cityLocation = data.location.region.length !== 0 ?
			`${data.location.region}, ${data.location.country}` :
			data.location.country
		setCurrentWeather({
			...data.current, cityName: data.location.name,
			cityLocation: cityLocation,
			localtime: data.location.localtime
		})
		setForecastWeather({
			...data.forecastWeather, cityName: data.location.name,
			cityLocation: cityLocation
		})
	}

	return (
		<div className="App">
			<Navbar />
			<div className="main">
				<SearchBar
					city={city}
					handleCityChange={handleCityChange}
					handleCityClick={handleCityClick}
					citySuggestions={citySuggestions} />
			</div>
			{currentWeather && <WeatherCard weather={currentWeather} />}
		</div>
	);
}

export default App;
