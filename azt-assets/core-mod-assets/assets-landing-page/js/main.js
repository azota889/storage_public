(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-K8GJT9F");

function setLang(la) {
    localStorage.setItem("switch_language_code", la);
    if (la == "en") {
        window.location.href = "/privacy/en/index.html";
    }
    if (la == "vi") {
        window.location.href = "/";
    }
}

$(document).ready(function () {
    $("#login_div").attr("href", "/vi/auth/login?t=" + Date.now());
    $("#register_div").attr("href", "/vi/auth/register?t=" + Date.now());
    if (localStorage.hasOwnProperty("user_obj")) {
        window.location.href = "/vi/auth/login?t=" + Date.now();
    } else {
        if (localStorage.getItem("switch_language_code") == "en") {
            window.location.href = "/privacy/en/index.html";
        }
    }
});

// Smooth scrolling với Tailwind
$(document).ready(function () {
    $("#gotoIntro").on("click", function () {
        document.getElementById("introduce").scrollIntoView({
            behavior: "smooth",
        });
    });

    $("#gotoFeature").on("click", function () {
        document.getElementById("feature").scrollIntoView({
            behavior: "smooth",
        });
    });
});

function play() {
    var el = document.getElementById("azt-video");
    el.play();
}

function onPlay() {
    document.getElementById("azt-video").scrollIntoView({
        behavior: "smooth",
    });
    document.getElementById("video-cover").classList.add("bg-gray-100");
}