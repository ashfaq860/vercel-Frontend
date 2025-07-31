import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSliderImages } from "../../api/internal";
import "./Slider.css"; // Importing custom CSS

const Slider = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const getSlider = async () => {
            const res = await getSliderImages();
            setSlides(res.data);
        };
        getSlider();
    }, []);

    const getImageSrc = (slide) => {
        if (slide.preview) return slide.preview;
        if (slide.url?.startsWith("http")) return slide.url;
        return `${process.env.REACT_APP_INTERNAL_API_PATH}${slide.url}`;
    };

    return (
        <>
            <div id="carouselExampleDark" className="carousel carousel-light slide" data-bs-ride="carousel">
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

                <div className="carousel-inner">
                    {slides.map((slide, index) => (
                        <div
                            key={slide._id || index}
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            data-bs-interval="7000"
                        >
                            <div className="slider-overlay">
                                <img
                                    src={getImageSrc(slide)}
                                    className="d-block w-100 slider-img"
                                    alt={slide.title || "Slide"}
                                    height="450"
                                />
                            </div>
                            <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
                                <h5 className="slider-title">
                                    <Link to={slide.link}>{slide.title}</Link>
                                </h5>
                                <p className="slider-desc">{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    );
};

export default Slider;
