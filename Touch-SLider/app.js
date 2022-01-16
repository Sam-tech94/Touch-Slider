const slider = document.querySelector(".slider-container"),
    slides = Array.from(document.querySelectorAll(".slide"));

let isDraggling = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0;
    
slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img");
    slideImage.addEventListener("dragstart", (e) => e.preventDefault());

    // touch event
    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove);

    // mouse event
    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);
    slide.addEventListener("mouseleave", touchEnd);
    slide.addEventListener("mousemove", touchMove);
});  

window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function getPositionX(event) {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
    return function(event) {
        currentIndex = index;
        startPos = getPositionX(event)
        isDraggling = true;
        animationID = requestAnimationFrame(animation);
        slider.classList.add("grabbing");
    }
}

function touchEnd() {
    isDraggling = false;
    cancelAnimationFrame(animationID);
    slider.classList.remove("grabbing");

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;

    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    setPositionByIndex()
    
}

function touchMove(event) {
    if (isDraggling) {
       const currentPosition = getPositionX(event);
       currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function animation() {
    setSliderPosition()
    if (isDraggling) requestAnimationFrame(animation);
}

function setSliderPosition() {
    slider.style.transform = `translate(${currentTranslate}px)`;
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
}


