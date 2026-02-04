import Slider from "react-slick";
import "../index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Optimized image imports with lazy loading capability
import carousel1 from "../images/hero-caroussel/hero-carousel-1.jpg";
import carousel2 from "../images/hero-caroussel/hero-carousel-2.jpg";
import carousel3 from "../images/hero-caroussel/hero-carousel-3.jpg";

// Slide content component (improves readability & reusability)
const SlideContent = ({ slide, index }) => (
  <div
    className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden"
    role="group"
    aria-roledescription="slide"
    aria-label={`Slide ${index + 1}: ${slide.title}`}
  >
    {/* Optimized image with fallback handling */}
    <img
      src={slide.image}
      alt={`${slide.title} - ${slide.description}`}
      className="w-full h-full object-cover transition-transform duration-700 will-change-transform"
      loading="lazy"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' fill='%2394a3b8'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
      }}
    />

    {/* Enhanced dual-layer gradient overlay for text readability */}
    <div
      className="absolute inset-0 z-[1] bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 z-[1] bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"
      aria-hidden="true"
    />

    {/* Content container with responsive padding */}
    <div className="absolute inset-0 z-[2] flex items-center">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl space-y-6 md:space-y-8 animate-fadeInSlide">
          {/* Animated decorative element */}
          <div
            className="w-20 h-1 bg-blue-500/90 rounded-full animate-slideIn"
            role="presentation"
          />

          {/* Title with responsive sizing */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight animate-slideUp"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            {slide.title}
          </h1>

          {/* Description with improved readability */}
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-prose animate-slideUp animation-delay-200">
            {slide.description}
          </p>

          {/* Enhanced CTA button with accessibility */}
          <div className="pt-4 animate-slideUp animation-delay-300">
            <a
              href={slide.ctaLink || "#"}
              className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:shadow-xl hover:shadow-blue-500/30"
              aria-label={`${slide.cta} for ${slide.title}`}
            >
              <span className="relative z-10 flex items-center">
                {slide.cta}
                <svg
                  className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Responsive trust indicators - visible on medium+ screens */}
    {slide.trustBadge && (
      <div className="absolute bottom-20 md:bottom-24 right-6 md:right-12 lg:right-16 z-[2] hidden md:block animate-fadeIn">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/15 shadow-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <p className="text-white/95 text-sm font-medium">
              {slide.trustBadge}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const HeroSlider = () => {
  // Enhanced slider settings with accessibility and performance
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
    pauseOnHover: false,
    pauseOnFocus: true,
    swipeToSlide: true,
    touchThreshold: 10,
    accessibility: true,
    useCSS: true,
    // Enhanced dot navigation with accessibility
    appendDots: (dots) => (
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center z-[3]"
        aria-label="Carousel controls"
      >
        <ul className="flex justify-center gap-3 md:gap-4 p-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button
        className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label={`Go to slide ${i + 1}`}
      >
        <span className="sr-only">Slide {i + 1}</span>
      </button>
    ),
    // Responsive settings
    responsive: [
      {
        breakpoint: 768,
        settings: {
          autoplaySpeed: 4500,
          speed: 700,
        },
      },
      {
        breakpoint: 480,
        settings: {
          autoplaySpeed: 4000,
          speed: 600,
          arrows: false,
        },
      },
    ],
  };

  // Enhanced slide data with additional properties
  const slideImages = [
    {
      image: carousel1,
      title: "Your Health, Our Priority",
      description:
        "Compassionate, personalized care focused on your wellbeing and recovery journey.",
      cta: "Book Appointment",
      ctaLink: "#appointments",
      trustBadge: "24/7 Emergency Care Available",
    },
    {
      image: carousel2,
      title: "Expert Medical Team",
      description:
        "Board-certified specialists with decades of combined experience in advanced treatments.",
      cta: "Meet Our Doctors",
      ctaLink: "#team",
      trustBadge: "JCI Accredited Facility",
    },
    {
      image: carousel3,
      title: "Comprehensive Wellness Services",
      description:
        "Integrated care from prevention to rehabilitation with cutting-edge technology.",
      cta: "Explore Services",
      ctaLink: "#services",
      trustBadge: "50,000+ Patients Served",
    },
  ];

  return (
    <section
      className="hero-slider relative overflow-hidden w-full"
      aria-label="Main promotional carousel"
    >
      <Slider
        {...settings}
        className="focus:outline-none"
        role="region"
        aria-roledescription="carousel"
      >
        {slideImages.map((slide, index) => (
          <div key={index} className="relative focus:outline-none">
            <SlideContent slide={slide} index={index} />
          </div>
        ))}
      </Slider>

      {/* Preload next slide image for smoother transitions */}
      <link
        rel="preload"
        as="image"
        href={slideImages[1]?.image}
        imagesrcset={`${slideImages[1]?.image} 1024w, ${slideImages[2]?.image} 2048w`}
      />
    </section>
  );
};

export default HeroSlider;
