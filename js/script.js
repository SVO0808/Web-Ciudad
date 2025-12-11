// Header

bars = document.querySelector('.bars');
bars.onclick = function() {
    navBar = document.querySelector('.nav_bar');
    navBar.classList.toggle('active');
}

const LAT = 41.1496;
const LON = -8.6109;

const weatherIcons = {
    0: "Sunny.jpg",
    1: "Sunny.jpg",
    2: "Partly.jpg",
    3: "Clouded.jpg",
    45: "Foggy.jpg",
    48: "Foggy.jpg",
    51: "Rainy.jpg",
    53: "Rainy.jpg",
    55: "Rainy.jpg",
    61: "Rainy.jpg",
    63: "Rainy.jpg",
    65: "Rainy.jpg",
    80: "Rainy.jpg",
    81: "Rainy.jpg",
    82: "Rainy.jpg",
    95: "Storm.jpg",
    96: "Storm.jpg",
    99: "Storm.jpg",
};

$(document).ready(() => loadWeather());

function loadWeather() {

    $.ajax({
        url: `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weathercode,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
        method: "GET",

        success: function(data) {

            $("#weather-city").text("Oporto");
            $("#weather-temp").text(data.current.temperature_2m + "°C");
            $("#weather-desc").text("Viento: " + data.current.wind_speed_10m + " km/h");

            const wcode = data.current.weathercode;
            const bg = weatherIcons[wcode] || "Partly.jpg";

            $("#weather-current").css("background-image", `url('img/weather/${bg}')`);

            showForecast(data.daily);
            drawChart(data.daily);
        }
    });
}

function showForecast(daily) {

    const container = $("#forecast-cards");
    container.empty();

    const dates = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;

    for (let i = 0; i < 4; i++) {

        const formatted = new Date(dates[i]).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        });

        container.append(`
            <div class="forecast-card">
                <p>${formatted}</p>
                <p>${maxTemps[i]}°C / ${minTemps[i]}°C</p>
                <small>Máx / Mín</small>
            </div>
        `);
    }
}

let weatherChart;

function drawChart(daily) {

    const labels = daily.time.map(d =>
        new Date(d).toLocaleDateString("es-ES", {
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
                    label: "Temperatura Máxima",
                    data: maxTemps,
                    borderColor: "#1F3C73",
                    backgroundColor: "#1F3C73",
                    pointRadius: 14,
                    pointHoverRadius: 18,
                    pointBackgroundColor: "#1F3C73",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 3,
                    tension: 0.3
                },
                {
                    label: "Temperatura Mínima",
                    data: minTemps,
                    borderColor: "#5A7DBE",
                    backgroundColor: "#5A7DBE",
                    pointRadius: 14,
                    pointHoverRadius: 18,
                    pointBackgroundColor: "#5A7DBE",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 3,
                    tension: 0.3
                }
            ]
        },
        options: { plugins: { legend: { display: false } } },
        plugins: [{
            id: 'labels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((ds, dsIndex) => {
                    chart.getDatasetMeta(dsIndex).data.forEach((pt, i) => {
                        ctx.save();
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "600 12px Inter";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(ds.data[i], pt.x, pt.y);
                        ctx.restore();
                    });
                });
            }
        }]
    });

    const legend = $("#chart-legend");
    legend.empty();

    weatherChart.data.datasets.forEach((ds, index) => {
        const button = $(`<button>${ds.label}</button>`);

        button.on("click", () => {
            const visible = weatherChart.isDatasetVisible(index);
            weatherChart.setDatasetVisibility(index, !visible);
            weatherChart.update();
            button.toggleClass("inactive", visible);
        });

        legend.append(button);
    });
}




$(document).ready(function() {

    // Array de imágenes del carrusel
    const heroImages = [
        'img/all/home1.jpg',
        'img/all/home2.jpg',
        'img/all/home3.jpg',
        'img/all/home4.jpg'
    ];

    let index = 0;

    function changeHeroBackground() {
        index = (index + 1) % heroImages.length;

        $('#hero').css('background-image', 'url(' + heroImages[index] + ')');
    }

    // Setea la primera imagen correctamente
    $('#hero').css('background-image', 'url(' + heroImages[0] + ')');

    // Cambia imagen cada 5s
    setInterval(changeHeroBackground, 5000);

});

/* ------------------------------------------------------ */
/* TIPS CAROUSEL — jQuery (versión centrada desde inicio) */
/* ------------------------------------------------------ */

$(document).ready(function () {

    const $carousel = $(".tips-carousel");
    const $slidesOriginal = $(".tip-slide");
    const total = $slidesOriginal.length;

    // Clonamos al principio y al final para infinito
    $carousel.append($slidesOriginal.clone());
    $carousel.prepend($slidesOriginal.clone());

    let index = total; // posición inicial real (centro)
    let slideWidth;

    function recalcWidth() {
        slideWidth = $(".tip-slide").outerWidth(true);
    }

    function updateTransform(animate = true) {
        const offset = -(index * slideWidth);
        if (!animate) {
            $carousel.css("transition", "none");
            $carousel.css("transform", `translateX(${offset}px)`);
            // Forzamos reflow para que la transición vuelva a funcionar
            $carousel[0].offsetHeight;
            $carousel.css("transition", "transform .45s ease");
        } else {
            $carousel.css("transform", `translateX(${offset}px)`);
        }
    }

    // Hacemos el primer cálculo después del render real
    setTimeout(() => {
        recalcWidth();
        updateTransform(false); // sin animación para que arranque centrado real
        updateDots();
    }, 30);

    // ---- DOTS ----
    const $dots = $(".tips-dots");
    for (let i = 0; i < total; i++) {
        $dots.append(`<button data-i="${i}"></button>`);
    }

    function updateDots() {
        const active = index % total;
        $(".tips-dots button").removeClass("active");
        $(".tips-dots button").eq(active).addClass("active");
    }

    $(".tips-dots button").click(function () {
        index = Number($(this).data("i")) + total;
        updateTransform();
        updateDots();
    });

    // ---- FLECHAS ----
    $(".tips-prev").click(() => advance(-1));
    $(".tips-next").click(() => advance(1));

    function advance(dir) {
        index += dir;

        // Rebote infinito
        if (index < 0) index = total - 1;
        if (index >= total * 3) index = total * 2;

        updateTransform();
        updateDots();
    }

    // ---- AUTOPLAY ----
    let autoplay;
    function startAutoplay() {
        autoplay = setInterval(() => advance(1), 3000);
    }
    function stopAutoplay() {
        clearInterval(autoplay);
    }
    startAutoplay();

    $(".tips-carousel-outer").hover(stopAutoplay, startAutoplay);

    // ---- SWIPE ----
    let startX = 0;

    $carousel.on("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    $carousel.on("touchend", e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (diff > 50) advance(-1);
        if (diff < -50) advance(1);
    });

    // ---- RESIZE ----
    $(window).on("resize", () => {
        recalcWidth();
        updateTransform(false);
    });

});
