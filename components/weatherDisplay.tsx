"use client";

import React, { useEffect, useState } from "react";

interface WeatherData {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

/**
 * WeatherDisplay component fetches and displays the current weather information
 * for a specific location using the Open-Meteo API.
 *
 * @component
 * @example
 * return (
 *   <WeatherDisplay />
 * )
 *
 * @returns {JSX.Element} The WeatherDisplay component.
 *
 * @remarks
 * This component uses the `useState` and `useEffect` hooks to manage the state
 * and side effects of fetching weather data. It displays a loading message while
 * fetching data, an error message if the fetch fails, and the current weather
 * information if the fetch is successful.
 *
 * @function
 * @name WeatherDisplay
 *
 * @typedef {Object} WeatherData
 * @property {Object} current_weather - The current weather data.
 * @property {number} current_weather.temperature - The current temperature in Fahrenheit.
 * @property {number} current_weather.windspeed - The current wind speed in mph.
 * @property {number} current_weather.weathercode - The weather code representing the current weather condition.
 *
 * @returns {JSX.Element} The rendered component.
 */
const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=30.62798&longitude=-96.33441&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();

        setWeatherData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode >= 1 && weatherCode <= 53) {
      return "/images/cloudy.png"; // Partly cloudy icon
    } else if (weatherCode >= 54) {
      return "/images/rainy.png"; // Rain icon
    }

    return "/images/sunny.png"; // Clear weather icon
  };

  return (
    <div className="absolute top-5 left-5 text-left">
      {loading && <p>Loading weather...</p>}
      {error && <p>Error: {error}</p>}
      {weatherData && weatherData.current_weather && (
        <div className="bg-white p-.5 w-80 h-auto rounded-lg shadow-lg flex items-center space-x-4">
          <img
            alt="Weather Icon"
            className="h-12 w-12"
            src={getWeatherIcon(weatherData.current_weather.weathercode)}
          />
          <div>
            <h3 className="text-md font-semibold">Current Weather</h3>
            <p>Temperature: {weatherData.current_weather.temperature}°F</p>
            <p>Wind Speed: {weatherData.current_weather.windspeed} mph</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
