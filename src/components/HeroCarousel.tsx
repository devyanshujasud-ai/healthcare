import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Find Your Perfect Doctor",
    description: "Connect with verified healthcare professionals instantly",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
    cta: "Browse Doctors",
  },
  {
    title: "Book Appointments Easily",
    description: "Schedule consultations that fit your schedule",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    cta: "Get Started",
  },
  {
    title: "Healthcare Made Simple",
    description: "Quality medical care at your fingertips",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=80",
    cta: "Learn More",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? "translate-x-0" : "translate-x-full"
          } ${index < currentSlide ? "-translate-x-full" : ""}`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="container mx-auto px-8 max-w-2xl">
                <h2 className="text-5xl font-bold text-white mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-xl text-white/90 mb-8 animate-fade-in">
                  {slide.description}
                </p>
                <Button
                  size="lg"
                  asChild
                  className="animate-fade-in bg-accent hover:bg-accent/90"
                >
                  <Link to="/doctors">{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};