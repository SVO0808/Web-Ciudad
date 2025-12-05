// Header

bars = document.querySelector('.bars');
bars.onclick = function() {
    navBar = document.querySelector('.nav_bar');
    navBar.classList.toggle('active');
}

// =======================================
// CONFIGURACIÓN — OPORTO
// =======================================
const LAT = 41.1496;   // latitud Oporto
const LON = -8.6109;   // longitud Oporto



// =======================================
// AL CARGAR LA PÁGINA
// =======================================
$(document).ready(() => {
    loadWeather();
});



// =======================================
// 1. CARGAR CLIMA ACTUAL (Open-Meteo)
// =======================================
function loadWeather() {

    $.ajax({
        url: `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
        method: "GET",

        success: function(data) {

            // Datos actuales reales
            const temp = data.current.temperature_2m;
            const wind = data.current.wind_speed_10m;

            $("#weather-city").text("Oporto");
            $("#weather-temp").text(temp + "°C");
            $("#weather-desc").text("Viento: " + wind + " km/h");

            // Pronóstico y gráfico
            showForecast(data.daily);
            drawChart(data.daily);
        },

        error: function() {
            alert("Error obteniendo el clima real");
        }
    });
}



// =======================================
// 2. TARJETAS PRONÓSTICO REAL + FECHA FORMATEADA
// =======================================
function showForecast(daily) {

    const container = $("#forecast-cards");
    container.empty();

    const days = daily.time;  
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;

    for (let i = 0; i < 4; i++) {

        // Formato: 05/12/25
        const formattedDate = new Date(days[i]).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        });

        container.append(`
            <div class="forecast-card">
                <p>${formattedDate}</p>
                <p>${maxTemps[i]}°C / ${minTemps[i]}°C</p>
                <small>Máx / Mín</small>
            </div>
        `);
    }
}



// =======================================
// 3. GRÁFICO REAL CON FECHAS FORMATEADAS
// =======================================
let weatherChart;

function drawChart(daily) {

    const rawDates = daily.time;
    const labels = rawDates.map(date =>
        new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        })
    );

    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;

    if (weatherChart) weatherChart.destroy();

    const ctx = document.getElementById("weatherChart");

    weatherChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Temp. Máxima (°C)",
                    data: maxTemps,
                    borderColor: "#1F3C73",
                    backgroundColor: "rgba(31, 60, 115, 0.2)",
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Temp. Mínima (°C)",
                    data: minTemps,
                    borderColor: "#5A7DBE",
                    backgroundColor: "rgba(90, 125, 190, 0.2)",
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        }
    });
}


