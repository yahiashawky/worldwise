// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../customContexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BAse_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat , lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const {isLoading , createCity} = useCities();

  async function handleSubmit(e) {
    e.preventDefault();
    if(!cityName || !country) return setErrorMessage("City name and country are required");

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      }
    }
    
    await createCity(newCity);
    navigate('/app/cities');
  }

  useEffect(() => {
    async function fetchCityData() {
      if(!lat || !lng) return;
      try{
        setIsLoadingGeolocation(true);
        setErrorMessage("");
        const rep = await fetch(`${BAse_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await rep.json();
        console.log(data)
        if(!data.city || !data.countryName || !data.countryCode){
          throw new Error("We couldn't find any city for your location");
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch(err){
        setErrorMessage(err.message);
      } finally{
        setIsLoadingGeolocation(false);
      }
  }
  fetchCityData();
}, [lat, lng]);


  if(isLoadingGeolocation) return <Spinner />

  if(!lat || !lng) return <Message message="Start by clicking the get location button and allow the app to access your location" />

   if(errorMessage) return <Message message={errorMessage}/>



  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          selected={date}
         onChange={day => setDate(day)}
         dateFormat="dd/MM/yyyy"
         />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button 
        type="primary"
        >
          add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
