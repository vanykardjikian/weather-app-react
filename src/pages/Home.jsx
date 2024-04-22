import SearchBar from './components/SearchBar.jsx'
import WeatherCard from './components/CurrentWeatherCard.jsx'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Forecast from './components/Forecast.jsx'
import Footer from './components/Footer.jsx'


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

	
	// Get weather data for user's location on reload
	useEffect(() => {
		let ignore = false
		const getCurrentLocation = async () => {
			try {
				const position = await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject)
				});
				if (!ignore) {
					const { latitude, longitude } = position.coords
					getWeatherData({ cityCoord: `${latitude},${longitude}` })
				}


			} catch (error) {
				console.error('Error fetching weather data:', error)
			}
		}

		getCurrentLocation()

		/*	
			This insures that the effect doesn't fire twice in development.
			Reference:
			https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
		*/
		return () => {
			ignore = true
		}

	}, [])

	
	// Fetch suggestions/autocomplete with 600ms delay
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


	const getWeatherData = async (selectedCity) => {
		try {
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
			setForecastWeather(data.forecast.forecastday)
		} catch (error) {
			console.error('Error fetching weather data:', error.message)
		}
	}

	return (
		<div className="font-sans min-h-screen flex flex-col dark:text-white text-black ">
			<Navbar />
			<div className='sm:w-4/5 w-11/12 mx-auto flex-grow'>
				<SearchBar
					city={city}
					handleCityChange={handleCityChange}
					handleCityClick={getWeatherData}
					citySuggestions={citySuggestions} />
				{(currentWeather && forecastWeather) &&
					<div className='mx-auto mb-7 grid xl:grid-cols-2 gap-5'>
						<WeatherCard weather={currentWeather} />
						<Forecast weather={forecastWeather} />
					</div>

				}
			</div>
			<Footer />
		</div>
	)
}

export default App;