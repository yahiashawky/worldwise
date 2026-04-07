import styles from './CityItem.module.css'
import PropTypes from 'prop-types'
import Emoji from 'react-emoji-render';  // قم بتثبيتها عبر npm
import { Link } from 'react-router-dom';
import { useCities } from '../customContexts/CitiesContext';


CityItem.propTypes = {
    city: PropTypes.object
}

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({city}) {
    const {currentCity , deleteCity} = useCities();

    const {cityName, date, emoji , id ,position} = city;

     async function handleDelete(e) {
        e.preventDefault();
        await deleteCity(id);
    }

    return (
        <Link to={`${id}?lat=${position.lat}&lng=${position.lng}`} className={`${styles.cityItem} ${currentCity.id === id ? styles['cityItem--active'] : ''}`}>
            {/* <span className={styles.emoji}>{emoji}</span> */}
            <span className={styles.emoji}><Emoji text={emoji} /></span>
            <h3 className={styles.name}>{cityName}</h3>
            <time className={styles.date}>{formatDate(date)}</time>
            <button className={styles.deleteBtn} onClick={handleDelete}>&times;</button>
        </Link>
    )
}

export default CityItem
