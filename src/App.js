import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [country, setCountry] = useState("US");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const API_KEY = "078d804f788c1e048391b0b09f1f87f4";

  const getData = async () => {
    if (!city.trim()) return;

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&lang=es&units=metric&appid=${API_KEY}`;

    try {
      const response = await axios.get(URL);
      if (response.data.cod !== 200) {
        setError("Ciudad no encontrada. Inténtalo de nuevo.");
        setWeather(null);
      } else {
        setWeather(response.data);
        setError(null);
      }
    } catch (error) {
      setError("Error al obtener datos. Verifica la ciudad e intenta nuevamente.");
      setWeather(null);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      getData();
    }
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };

  const getBackgroundColor = () => {
    if (!weather) return "#ffffff"; // Fondo blanco por defecto

    const tempCelsius = weather.main.temp;
    if (tempCelsius < 15) return "#00aaff"; // Azul para frío (hasta 15°C)
    if (tempCelsius >= 15 && tempCelsius <= 25) return "#ffa500"; // Naranja para templado (15°C - 25°C)
    return "#ff4500"; // Rojo para caliente (más de 25°C)
  };

  return (
    <div className="app-container" style={{ backgroundColor: getBackgroundColor() }}>
      <div className="container">
        <h2>React Clima Proyecto</h2>

        {/* Selector de país */}
        <select onChange={(e) => setCountry(e.target.value)} value={country}>
          <option value="US">Estados Unidos</option>
          <option value="MX">México</option>
          <option value="AR">Argentina</option>
          <option value="CO">Colombia</option>
          <option value="CR">Costa Rica</option>
          <option value="ES">España</option>
          <option value="PE">Perú</option>
          <option value="IT">Italia</option>
        </select>

        {/* Input para la ciudad */}
        <input
          type="text"
          placeholder="Escribe una ciudad..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleSearch}
        />

        {/* Switch para cambiar unidades */}
        <div className="unit-toggle">
          <span>°C</span>
          <label className="switch">
            <input type="checkbox" onChange={toggleUnit} checked={!isCelsius} />
            <span className="slider"></span>
          </label>
          <span>°F</span>
        </div>
      </div>

      <div className="card">
        {error ? (
          <h1>{error}</h1>
        ) : weather ? (
          <div className="card-container">
            <h1 className="city-name">
              {weather.name}, {weather.sys.country}
            </h1>
            <p className="temp">
              {convertTemperature(weather.main.temp).toFixed(0)}°
              {isCelsius ? "C" : "F"}
            </p>
            <img
              className="icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="icon-weather"
            />
            <p className="description">{weather.weather[0].description}</p>

            {/* Información adicional */}
            <div className="extra-info">
              <p>
                <strong>Sensación térmica:</strong>{" "}
                {convertTemperature(weather.main.feels_like).toFixed(0)}°
                {isCelsius ? "C" : "F"}
              </p>
              <p>
                <strong>Humedad:</strong> {weather.main.humidity}%
              </p>
              <p>
                <strong>Presión:</strong> {weather.main.pressure} hPa
              </p>
              <p>
                <strong>Viento:</strong> {weather.wind.speed} m/s | Dirección:{" "}
                {weather.wind.deg}°
              </p>
            </div>

            <div className="card-footer">
              <p className="temp-max-min">
                {convertTemperature(weather.main.temp_min).toFixed(0)}°
                {isCelsius ? "C" : "F"} |{" "}
                {convertTemperature(weather.main.temp_max).toFixed(0)}°
                {isCelsius ? "C" : "F"}
              </p>
            </div>
          </div>
        ) : (
          <h3>Ingresa una ciudad y presiona Enter</h3>
        )}
      </div>
    </div>
  );
}

export default App;
