# 🌦 Weather Insight App

## 📌 Overview

This is a React-based weather application that allows users to search for any city and view:

* Current weather conditions
* Temperature trends over the next few days
* Smart insights based on weather data

The app uses the OpenWeather API and displays data in a clean, wireframe-inspired UI.

---

## 🚀 Features

* 🔍 Search weather by city name
* ⌨️ Press **Enter key** or click button to search
* 🌡 Displays current temperature and condition
* 📊 Line chart showing temperature trends
* 🧠 Smart weather insights:

  * Detects rain
  * Identifies very hot or cold days
  * Suggests the best day to go out
* 🎨 Styled UI matching a wireframe design
* 🖥 Centered layout with custom header (window-style dots)

---

## 🧠 Insight Logic

The app determines insights based on:

* Rain probability
* Temperature extremes
* Comfort range (~20–25°C)

Example outputs:

* “Rain expected on Thursday”
* “Very hot day expected on Saturday (36°C)”
* “Best day to go out: Friday (24°C)”
* “Cool week overall, best day is Wednesday (15°C)”

---

## 🛠 Technologies Used

* React (Vite)
* Chart.js (react-chartjs-2)
* OpenWeather API

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-link>
cd <your-project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root folder and add:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

---

## 📂 Project Structure

```
src/
  App.jsx        # Main application logic and UI
```

---

## 📈 Future Improvements

* Add weather icons
* Highlight best day on chart
* Add loading spinner animation
* Improve mobile responsiveness

---

## 👨‍💻 Author

Your Name

---

## 📄 License

This project is for educational purposes.
