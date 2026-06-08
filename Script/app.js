
let slideIndex = 0;

function showSlides() {

    const slides =
    document.querySelectorAll(".slide");

    if(slides.length === 0) return;

    slides.forEach(slide=>{
        slide.style.display = "none";
    });

    slideIndex++;

    if(slideIndex > slides.length){
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block";
}

setInterval(showSlides,3000);

window.onload = function(){

    showSlides();

    if(typeof renderCart === "function"){
        renderCart();
    }
};
