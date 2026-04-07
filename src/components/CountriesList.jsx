import styles from './CountryList.module.css'
import CountryItem from './CountryItem'
import Message from './Message'
import Spinner from './Spinner'
import { useCities } from '../customContexts/CitiesContext';



function CountriesList() {
    const {cities, isLoading} = useCities();

    // const country = Array.from(new Set(cities.map(city => city.country)))

    const countries = cities.reduce((array, city) => {
        if(!array.map(el => el.country).includes(city.country))
            return [...array , {country : city.country , emoji: city.emoji} ]
        else return array
    } , [])

    console.log(countries)

   
    if (isLoading) return <Spinner /> 
    if(!cities.length) return <Message message={"Add your first city by clicking on a city on the map"} />
    return (
        <ul className={styles.countryList}>
            {countries.map((country , index) => (
                <CountryItem country={country} key={index} />
            ))}
        </ul>
    )
}

export default CountriesList
