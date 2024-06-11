import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "animate.css";
import "gantt-task-react/dist/index.css";
import "./index.scss";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

// #Essentials
// npm i -D react-router-dom@latest
// npm i sass
// npm i bootstrap@latest
// npm i axios
// npm i recoil
// npm install --save react-apexcharts apexcharts

// #Fontawesome
// npm i --save @fortawesome/fontawesome-svg-core
// npm i --save @fortawesome/free-solid-svg-icons
// npm i --save @fortawesome/free-regular-svg-icons
// npm i --save @fortawesome/free-brands-svg-icons
// npm i --save @fortawesome/react-fontawesome@latest

// #Optional
// npm i sweetalert2
// npm i swiper
// npm i wowjs
// npm i animate.css --save

// #How to use
// # wow js
// import { WOW } from "wowjs";
// useEffect(() => {
//   const wow = new WOW({ live: false });
//   wow.init();
// });
