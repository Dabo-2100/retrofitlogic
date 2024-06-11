import React from "react";
import { useRecoilState } from "recoil";
import { $ActiveModal, $ActiveForm } from "@/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useState } from "react";
import f_1001 from "@/assets/1001.png";
import f_1002 from "@/assets/1002.png";
import f_1003 from "@/assets/1003.png";
import f_1003_b from "@/assets/1003_b.png";
import { $FormData } from "@/store";
export default function BlankFormCreator() {
    const [forms] = useState([
        {
            name: "Form 1001",
            img: f_1001,
            value: 1001
        },
        {
            name: "Form 1002",
            img: f_1002,
            value: 1002
        },
        {
            name: "Form 1003",
            img: f_1003,
            value: 1003
        },
        {
            name: "Form 1003 Back",
            img: f_1003_b,
            value: 10030
        },
    ]);
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [, setActiveForm] = useRecoilState($ActiveForm);
    const [, setFormData] = useRecoilState($FormData);

    const openForm = (formNo) => {
        setFormData({
            formInfo: {
                sheet_no: null,
                aircraft_sn: "49064",
                af_hrs: "616.5",
                aircraft_mk: "KM10",
            },
            formRows: [],
        });
        setActiveModal(1000);
        setActiveForm(formNo);
    }
    return (
        <div className="col-12 d-flex flex-wrap justify-content-center">
            <h1 className="col-12  mb-3 animate__animated animate__fadeIn" style={{ color: "white", fontSize: "24px" }}>Create blank form</h1>
            <Swiper
                className="col-12 Slider"
                modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
                navigation
                pagination={{ clickable: true }}
                mousewheel={{ enabled: true }}
                spaceBetween={30}
                slidesPerView={3}
            >
                {
                    forms.map((form, index) => {
                        return (
                            <SwiperSlide key={index}
                                className="Slide animate__animated animate__fadeInUp" style={{
                                    animationDuration: "400ms",
                                    animationDelay: `${200 + (index * 150)}ms`
                                }} onClick={() => { openForm(form.value) }}>
                                <img src={form.img} />
                                <p>{form.name}</p>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>
            <hr className="col-12" />
        </div>
    )
}
