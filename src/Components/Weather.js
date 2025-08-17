import React, { useState, useEffect } from 'react';
import './weather.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');

  // Your OpenWeatherMap API key
  const API_KEY = "4f8e795dcd6dbf7b9f5276bff095ffc1";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '☀️';
    }
  };

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // Using real API now with your key
      const response = await fetch(
        `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeather(data);
      } else {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeather(data);
      } else {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchWeatherData("London");
  }, []);

  return (
    <div className="weather-app">
      <div className="weather-container">
        <h1 className="app-title">Weather App</h1>
        
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              🔍
            </button>
          </div>
          
          <button onClick={getCurrentLocation} className="location-btn">
            📍 Use Current Location
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <small>Please check the city name and try again.</small>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-display">
            <div className="weather-header">
              <h2>{weather.name}, {weather.sys?.country}</h2>
              <p className="weather-description">{weather.weather?.[0]?.description}</p>
            </div>

            <div className="weather-main">
              <div className="weather-icon">
                {getWeatherIcon(weather.weather?.[0]?.main)}
              </div>
              <div className="temperature">
                <span className="temp-value">{Math.round(weather.main?.temp)}°C</span>
                <p className="feels-like">Feels like {Math.round(weather.main?.feels_like)}°C</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <div className="detail-icon">🌡️</div>
                <div className="detail-info">
                  <span className="detail-label">Feels like</span>
                  <span className="detail-value">{Math.round(weather.main?.feels_like)}°C</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">💧</div>
                <div className="detail-info">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{weather.main?.humidity}%</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">💨</div>
                <div className="detail-info">
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{weather.wind?.speed} m/s</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">👁️</div>
                <div className="detail-info">
                  <span className="detail-label">Visibility</span>
                  <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <div className="last-updated">
              Last updated: {new Date(weather.dt * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;