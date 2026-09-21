import { useEffect, useState } from 'react';
import { LiveWeatherInfo } from '../types/campus';

function getWeatherConditionText(code: number): string {
  switch (code) {
    case 0: return 'Clear Sky';
    case 1: return 'Mainly Clear';
    case 2: return 'Partly Cloudy';
    case 3: return 'Overcast';
    case 45:
    case 48: return 'Foggy';
    case 51:
    case 53:
    case 55: return 'Light Drizzle';
    case 61:
    case 63:
    case 65: return 'Rain';
    case 80:
    case 81:
    case 82: return 'Rain Showers';
    case 95: return 'Thunderstorm';
    default: return 'Humid';
  }
}

/** Current time at SRM KTR (IST, UTC+5:30), updating every second. */
export function useIstClock(): string {
  const [clock, setClock] = useState(() => formatIstNow());

  useEffect(() => {
    const interval = setInterval(() => setClock(formatIstNow()), 1000);
    return () => clearInterval(interval);
  }, []);

  return clock;
}

function formatIstNow(): string {
  const nowUtcMinutes = Date.now() / 60000; // minutes since epoch UTC
  const istMinutes = Math.floor(nowUtcMinutes + 330) % 1440; // +5h30m
  const h = Math.floor(istMinutes / 60);
  const m = istMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function useLiveWeather() {
  const [weather, setWeather] = useState<LiveWeatherInfo>({
    temperatureC: 31.4,
    relativeHumidity: 68,
    weatherCode: 2,
    conditionText: 'Partly Cloudy',
    isLive: false,
    updatedAt: '—',
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=12.823&longitude=80.044&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code'
        );
        if (!res.ok) return;
        const data = await res.json();

        if (data && data.current && isMounted) {
          const temp = Math.round(data.current.temperature_2m * 10) / 10;
          const apparent = Math.round((data.current.apparent_temperature ?? temp) * 10) / 10;
          const humidity = Math.round(data.current.relative_humidity_2m);
          const code = data.current.weather_code ?? 2;

          setWeather({
            temperatureC: temp,
            relativeHumidity: humidity,
            apparentTemperatureC: apparent,
            weatherCode: code,
            conditionText: getWeatherConditionText(code),
            isLive: true,
            updatedAt: formatIstNow(),
          });
        }
      } catch (err) {
        console.warn('Live weather fetch fallback active:', err);
      }
    }

    fetchLiveWeather();
    const interval = setInterval(fetchLiveWeather, 600000); // refresh every 10 min

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return weather;
}
