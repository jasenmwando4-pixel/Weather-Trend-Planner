import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [trend, setTrend] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

  const fetchWeather = async () => {
    if (!API_KEY) {
      alert("Missing API key. Restart server after adding .env");
      return;
    }

    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (!res.ok || !data.list) {
        alert(data.message || "City not found");
        return;
      }

      const daily = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = [];
        daily[date].push(item.main.temp);
      });

      const processed = Object.keys(daily)
        .slice(0, 7)
        .map((date) => {
          const entries = data.list.filter((item) => item.dt_txt.startsWith(date));
          const temps = daily[date];
          const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
          const rainCount = entries.filter((item) =>
            item.weather[0].main.toLowerCase().includes("rain") || item.pop > 0.6
          ).length;
          const rainProbability = Math.round((rainCount / entries.length) * 100);

          return {
            date,
            day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            temp: Math.round(avg),
            max: Math.round(Math.max(...temps)),
            min: Math.round(Math.min(...temps)),
            rainProbability,
          };
        });

      if (processed.length === 0) {
        alert("No forecast data available.");
        return;
      }

      const hottest = processed.reduce((a, b) => (b.temp > a.temp ? b : a));
      const coldest = processed.reduce((a, b) => (b.temp < a.temp ? b : a));
      const rainyDay = processed.find((day) => day.rainProbability > 60);
      const bestDay = processed.reduce((prev, curr) =>
      Math.abs(curr.temp - 25) < Math.abs(prev.temp - 25) ? curr : prev
      );

      let insightText;

if (rainyDay) {
  insightText = `Rain expected on ${rainyDay.day}`;
} else if (hottest.temp > 35) {
  insightText = `Very hot day expected on ${hottest.day} (${hottest.temp}°C)`;
} else if (coldest.temp < 5) {
  insightText = `Cold warning on ${coldest.day} (${coldest.temp}°C)`;
} else if (bestDay.temp < 16) {
  insightText = `Cool week overall, best day is ${bestDay.day} (${bestDay.temp}°C)`;
} else {
  insightText = `Best day to go out: ${bestDay.day} (${bestDay.temp}°C)`;
}

      setWeather({
        city: data.city.name,
        temp: Math.round(data.list[0].main.temp),
        condition: data.list[0].weather[0].main,
      });

      setTrend(processed);
      setInsight(insightText);
    } catch (err) {
      console.error(err);
      alert("Error fetching weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: trend.map((d) => d.day),
    datasets: [
      {
        data: trend.map((d) => d.temp),
        borderColor: "blue",
        borderWidth: 1,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true } },
    },
  };

  return (

 <div style={{ border: "2px solid black", width: 500, margin: "40px auto" }}>

  {/* HEADER */}
  <div style={{ 
  borderBottom: "2px solid black", 
  padding: 10, 
  display: "flex", 
  alignItems: "center",
  background: "white"
}}>
    
    {/* dots */}
    <div style={{ display: "flex", gap: 6 }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "red" }}></div>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "orange" }}></div>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "green" }}></div>
    </div>

    {/* space bar */}
    <div style={{ flex: 1, border: "1px solid black", height: 14, marginLeft: 10 }}></div>

  </div>

  <div style={{ padding: 20 }}>

    {/* SEARCH */}
<div style={{ border: "2px solid black", padding: 10, display: "flex", gap: 10 }}>
  <span>Enter city:</span>
 <input
  style={{ border: "1px solid black", flex: 1 }}
  value={city}
  onChange={(e) => setCity(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  }}
/>
  <button style={{ border: "1px solid black" }} onClick={fetchWeather}>
    Search
  </button>
</div>

        {loading && <p style={{ marginTop: 15 }}>Loading...</p>}

        {/* WEATHER */}
        {weather && (
          <div style={{ border: "2px solid black", marginTop: 20 }}>
            <div style={{ borderBottom: "2px solid black", padding: 5 }}>
              {weather.city}
            </div>
            <div style={{ padding: 10 }}>
              <div>Temperature: {weather.temp}°C</div>
              <div>Condition: {weather.condition}</div>
            </div>
          </div>
        )}

        {/* TREND */}
        {trend.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div>Temperature Trend</div>
            <div style={{ borderTop: "2px solid black", margin: "5px 0" }} />
            <div style={{ border: "2px solid black", padding: 10 }}>
              <div style={{ fontSize: 12 }}>Temperature (°C)</div>
              <div style={{ height: 200 }}>
                <Line data={chartData} options={options} />
              </div>
            </div>
          </div>
        )}

        {/* INSIGHT */}
        {insight && (
          <div style={{ border: "2px solid black", marginTop: 20 }}>
            <div style={{ borderBottom: "2px solid black", padding: 5 }}>
              Insight
            </div>
            <div style={{ padding: 10 }}>{insight}</div>
          </div>
        )}
      </div>
    </div>
  );
}
