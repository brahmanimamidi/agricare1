export interface WeatherData {
    city: string
    temperature: number
    feelsLike: number
    humidity: number
    rainfall: number
    windSpeed: number
    condition: string
    icon: string
    farmingTip: string
}

export async function getWeatherForCity(
    city: string
): Promise<WeatherData> {

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (response.status === 429) {
            throw new Error('Weather service busy. Please wait and try again.');
        }

        if (response.status === 401) {
            throw new Error('API key invalid. Please check configuration.');
        }

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please use full city name like Visakhapatnam instead of Vizag');
            }
            throw new Error(`Weather service error: ${response.status}`);
        }

        const data = await response.json();

        const condition = data.weather[0].main
        const temp = data.main.temp
        const humidity = data.main.humidity
        const rainfall = data.rain?.['1h'] || 0
        const windSpeed = data.wind.speed

        // Generate farming tip based on weather
        let farmingTip = ''

        if (condition === 'Rain' || condition === 'Drizzle') {
            farmingTip = '🌧️ Rain detected — avoid pesticide spraying today. Good day for transplanting.'
        } else if (condition === 'Thunderstorm') {
            farmingTip = '⛈️ Thunderstorm alert — secure your crops and avoid field work today.'
        } else if (temp > 38) {
            farmingTip = '🌡️ Very hot today — water your crops early morning or evening only.'
        } else if (temp > 32) {
            farmingTip = '☀️ Hot weather — ensure adequate irrigation. Best time to spray: early morning.'
        } else if (temp < 15) {
            farmingTip = '❄️ Cold weather — protect sensitive crops from frost damage tonight.'
        } else if (humidity > 85) {
            farmingTip = '💧 High humidity — watch for fungal diseases. Ensure good air circulation.'
        } else if (windSpeed > 10) {
            farmingTip = '💨 Strong winds — avoid spraying pesticides. Check crop support stakes.'
        } else {
            farmingTip = '✅ Good farming weather today — ideal for field work and spraying.'
        }

        return {
            city: data.name,
            temperature: Math.round(temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity,
            rainfall: Math.round(rainfall * 100) / 100,
            windSpeed: Math.round(windSpeed * 3.6),
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            farmingTip
        }
    } catch (error: any) {
        console.error('Weather service error:', error);
        throw error;
    }
}
