import Slider from "react-slick";
import "../index.css"

import carousel1 from "../images/hero-caroussel/hero-carousel-1.jpg";
import carousel2 from "../images/hero-caroussel/hero-carousel-2.jpg";
import carousel3 from "../images/hero-caroussel/hero-carousel-3.jpg";
const HeroSlider = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    pauseOnHover: true,
    appendDots: (dots) => (
      <div className="absolute bottom-8 left-0 right-0">
        <ul className="flex justify-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300 hover:scale-125" />
    ),
  };

  const slideImages = [
    {
      image: carousel1,
      title: "Your Health, Our Priority",
      description: "Providing compassionate care for a healthier you.",
      cta: "Book Appointment",
    },
    {
      image: carousel2,
      title: "Expert Medical Care",
      description: "Trusted professionals for your health needs.",
      cta: "Meet Our Team",
    },
    {
      image: carousel3,
      title: "Comprehensive Services",
      description: "From diagnosis to treatment, we're here for you.",
      cta: "Our Services",
    },
  ];

  return (
    <>
      <div className="hero-slider relative overflow-hidden">
        <Slider {...settings}>
          {slideImages.map((slide, index) => (
            <div key={index} className="relative">
              <div className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
                {/* Image with overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-[1] " />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1] " />

                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover scale-105 animate-zoom"
                />

                {/* Content */}
                <div className="absolute inset-0 z-[2] flex items-center">
                  <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="max-w-2xl space-y-6">
                      {/* Decorative line */}
                      <div className="w-20 h-1 bg-blue-500 animate-slideRight" />

                      {/* Title */}
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slideUp delay-200">
                        {slide.title}
                      </h2>

                      {/* Description */}
                      <p className="text-lg md:text-xl text-gray-200 leading-relaxed animate-slideUp delay-400">
                        {slide.description}
                      </p>

                      {/* CTA Button */}
                      <div className="pt-4 animate-slideUp delay-600">
                        <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
                          <span className="relative z-10">{slide.cta}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional: Trust indicators */}
                <div className="absolute bottom-24 md:bottom-28 right-8 md:right-16 z-[2] hidden lg:flex items-center gap-4 animate-slideLeft">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3 border border-white/20">
                    <p className="text-white/90 text-sm font-medium">
                      24/7 Emergency Care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HeroSlider;
