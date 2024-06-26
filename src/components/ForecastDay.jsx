import PropTypes from 'prop-types'
import WeatherIcons from '../data/WeatherIcons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const getDate = (dateStr) => {
	const date = new Date(dateStr)
	const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
	const dayOfWeekString = days[date.getDay()]
	const dayMonth = date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'numeric',
	})

	return { day: dayOfWeekString, date: dayMonth }
}

const ForecastDay = ({ dayWeather, index }) => {

	const [isOpen, setIsOpen] = useState(false)

	const date = getDate(dayWeather.date)
	const weatherCode = dayWeather.day.condition.code
	const iconData = WeatherIcons[weatherCode]
	const icon = iconData === undefined ? "bi bi-thermometer-half" : iconData.iconDay

	return (
		<div onClick={() => setIsOpen(prev => !prev)}
			className="bg-transparent hover:bg-gray-200 hover:dark:bg-gray-900 flex flex-col py-3 px-7 border-b-2 h-full dark:border-gray-900 w-full text-black dark:text-white">
			<div className="grid grid-cols-12 flex-grow">
				<div className='col-span-3 flex flex-col items-start justify-center sm:text-xl xs:text-base text-sm'>
					<b className='font-black text-amber-600 dark:text-amber-300'>{index === 0 ? 'TODAY' : date.day}</b>
					<p className='text-gray-600 dark:text-gray-400 sm:text-base xs:text-sm text-xs'>{date.date}</p>
				</div>

				<div className='col-span-5 flex items-center'>
					<i className={icon + ' sm:text-5xl xs:text-4xl text-3xl mr-2'}></i>
					<div className="h-fit flex flex-col ">
						<b className="sm:text-2xl xs:text-xl text-base">{`${dayWeather.day.maxtemp_c}°`}</b>
						<div className="text-gray-600 dark:text-gray-400 sm:text-xl xs:text-base text-sm">{`${dayWeather.day.mintemp_c}°C`}</div>
					</div>
				</div>

				<div className="col-span-4 flex items-center justify-self-end">
					<h3 className="font-bold sm:text-xl xs:text-base text-sm text-right">{dayWeather.day.condition.text}</h3>
				</div>

			</div>
			<div className='flex justify-end'>
				<button style={{ WebkitTextStroke: '1px' }} className='font-black text-amber-600 dark:text-amber-300'>
					<i className={"bi bi-chevron-" + (isOpen ? 'up' : 'down')}></i>
				</button>
			</div>
			<div className={`overflow-hidden flex flex-col justify-end transition-height duration-300 ease-in-out ${isOpen ? 'h-20 visible' : 'h-0 invisible'}`}>

				{isOpen &&
					<div className='flex flex-col items-end'>
						<div className="w-full grid grid-cols-2 mt-5 sm:text-base xs-text-sm text-xs text-gray-600 dark:text-gray-400">
							<div>
								<p><b className="text-gray-700 dark:text-gray-300">Wind: </b> {dayWeather.day.maxwind_kph} km/h</p>
								<p><b className="text-gray-700 dark:text-gray-300">Humidity: </b> {dayWeather.day.avghumidity}%</p>
							</div>

							<div className='justify-self-end text-right'>
								<p><b className="text-gray-700 dark:text-gray-300">Rain: </b> {dayWeather.day.daily_chance_of_rain}%</p>
								<p><b className="text-gray-700 dark:text-gray-300">Snow: </b> {dayWeather.day.daily_chance_of_snow}%</p>
							</div>


						</div>
						<Link to='/hourly'
							state={{ weather: dayWeather.hour, date: dayWeather.date}}
							className='sm:text-sm text-xs text-blue-500 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 w-fit font-semibold underline-offset-2 py-1 mt-1 transition'
						> 
							See hourly <i className="bi bi-arrow-right-short"></i></Link>
					</div>}
			</div>
		</div>
	)
}

ForecastDay.propTypes = {
	dayWeather: PropTypes.shape({
		date: PropTypes.string.isRequired,
		day: PropTypes.shape({
			condition: PropTypes.shape({
				code: PropTypes.number.isRequired,
				text: PropTypes.string.isRequired,
			}).isRequired,
			maxtemp_c: PropTypes.number.isRequired,
			mintemp_c: PropTypes.number.isRequired,
			maxwind_kph: PropTypes.number.isRequired,
			avghumidity: PropTypes.number.isRequired,
			daily_chance_of_rain: PropTypes.number.isRequired,
			daily_chance_of_snow: PropTypes.number.isRequired,
		}).isRequired,
	}).isRequired,
	index: PropTypes.number.isRequired,
}

export default ForecastDay