// Parallax Scroll JavaScript Code

var ticking = false;
var isFirefox = (/Firefox/i.test(navigator.userAgent));
var isIe = (/MSIE/i.test(navigator.userAgent)) || (/Trident.*rv\:11\./i.test(navigator.userAgent));
var scrollSensitivitySetting = 30; // Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive)
var slideDurationSetting = 600; // Amount of time for which slide is "locked"
var currentSlideNumber = 0;
var totalSlideNumber = $(".background").length;

// Function to handle the parallax scroll event
function parallaxScroll(evt) {
    var delta;
    
    // Adjusting delta value based on browser type
    if (isFirefox) {
        delta = evt.detail * (-120); // Firefox uses evt.detail
    } else if (isIe) {
        delta = -evt.deltaY; // IE uses evt.deltaY in reverse
    } else {
        delta = evt.wheelDelta; // Other browsers use evt.wheelDelta
    }

    // Check if a scroll event is not already in progress
    if (!ticking) {
        // Handle down scroll
        if (delta <= -scrollSensitivitySetting) {
            ticking = true;
            if (currentSlideNumber !== totalSlideNumber - 1) {
                currentSlideNumber++;
                nextItem();
            }
            slideDurationTimeout(slideDurationSetting);
        }
        
        // Handle up scroll
        if (delta >= scrollSensitivitySetting) {
            ticking = true;
            if (currentSlideNumber !== 0) {
                currentSlideNumber--;
                previousItem();
            }
            slideDurationTimeout(slideDurationSetting);
        }
    }
}

// Function to prevent rapid slide changes
function slideDurationTimeout(slideDuration) {
    setTimeout(function () {
        ticking = false; // Allows for a new scroll after the timeout period
    }, slideDuration);
}

// Event listener for scroll events, throttle used to control the rate of event firing
var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);

// Function to handle the next slide animation (down scroll)
function nextItem() {
    var $previousSlide = $(".background").eq(currentSlideNumber - 1);
    $previousSlide.removeClass("up-scroll").addClass("down-scroll");
}

// Function to handle the previous slide animation (up scroll)
function previousItem() {
    var $currentSlide = $(".background").eq(currentSlideNumber);
    $currentSlide.removeClass("down-scroll").addClass("up-scroll");
}

// Optional: Add support for touch events (mobile devices)
let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function (e) {
    const touchEndY = e.touches[0].clientY;
    const touchDifference = touchStartY - touchEndY;

    if (!ticking) {
        if (touchDifference > 50) { // Down swipe
            ticking = true;
            if (currentSlideNumber !== totalSlideNumber - 1) {
                currentSlideNumber++;
                nextItem();
            }
            slideDurationTimeout(slideDurationSetting);
        }
        if (touchDifference < -50) { // Up swipe
            ticking = true;
            if (currentSlideNumber !== 0) {
                currentSlideNumber--;
                previousItem();
            }
            slideDurationTimeout(slideDurationSetting);
        }
    }
});
