import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const slides = [
    { id: 1, content: 'Slide 1' },
    { id: 2, content: 'Slide 2' },
    { id: 3, content: 'Slide 3' },
];

export default function SwiperSlider() {
    return (
        <div className="max-w-xl mx-auto mt-10">
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                navigation={true}
                className="rounded-lg shadow-lg"
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div className="p-10 text-center bg-gradient-to-r from-gray-200 to-blue-100 rounded-lg flex flex-col items-center">
                            <span className="text-lg font-semibold mb-2">{slide.content}</span>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                Action
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="mt-6 text-center text-gray-500">
                <span>Swipe or use arrows to navigate</span>
            </div>
        </div>
    );
}