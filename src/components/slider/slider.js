import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSliderImages } from "../../api/internal";
import "./slider.css"; // We'll use custom styles

const Slider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const getSlider = async () => {
      const res = await getSliderImages();
      setSlides(res.data);
    };
    getSlider();

    // Re-initialize Bootstrap carousel when slides load
    const interval = setTimeout(() => {
      if (window.bootstrap) {
        const carouselElement = document.querySelector("#carouselExampleDark");
        if (carouselElement) {
          new window.bootstrap.Carousel(carouselElement, {
            interval: 4000,
            ride: "carousel",
            pause: false,
            wrap: true,
          });
        }
      }
    }, 1000);

    return () => clearTimeout(interval);
  }, []);

  const getImageSrc = (slide) => {
    if (slide.preview) return slide.preview;
    if (slide.url?.startsWith("http")) return slide.url;
    return `${process.env.REACT_APP_INTERNAL_API_PATH}${slide.url}`;
  };

  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={slide._id || index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            data-bs-interval="4000"
          >
            <img
              src={getImageSrc(slide)}
              className="d-block w-100 slider-img"
              alt={slide.title || "Slide Image"}
            />
            <div className="carousel-caption d-none d-md-block gradient-overlay">
              <h2 className="slider-title">{slide.title}</h2>
              <p className="slider-description">{slide.description}</p>
              {slide.link && (
                <Link to={slide.link} className="btn btn-warning mt-2">
                  View More
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;
