new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,

    //pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets:true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    //Responsive 
    breakpoints: {
        0: {
            slidesPerView:1
        },
        768: {
            slidesPerView:3
        },
        1024: {
            slidesPerView:4
        }
    }
});
