import carousel1 from '../../public/images/hero-caroussel/carousel-1.jpg';

import Slider from 'react-slick';
const HeroSlider = () => {


    const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 3000,
      fade: true,
      arrows: false,
      slidesToScroll: 1,
      slidesToShow: 1
    };

    const slideImages = [
        {
            image: '/images/slide1.jpg',
            title:"Your Health, Our Priority",
            description:"Providing compassionate care for a healthier you."
        },
        {
            image: '/images/slide2.jpg',
            title:"Expert Medical Care",
            description:"Trusted professionals for your health needs."
        },
        {
            image: '/images/slide3.jpg',
            title:"Comprehensive Services",
            description:"From diagnosis to treatment, we're here for you."
        }
    ];
    return (
        <div className="hero-slider">
            <Slider {...settings}>
                <div className="slide">
                    <img src="/images/slide1.jpg" alt="Slide 1" />
                </div>
                <div className="slide">
                    <img src="/images/slide2.jpg" alt="Slide 2" />
                </div>
                <div className="slide">
                    <img src="/images/slide3.jpg" alt="Slide 3" />
                </div>
            </Slider>
        </div>
        
    )
}

export default HeroSlider