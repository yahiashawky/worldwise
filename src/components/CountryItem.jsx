import styles from "./CountryItem.module.css";
import propTypes from 'prop-types'


CountryItem.propTypes = {
    country: propTypes.object,
}


function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
