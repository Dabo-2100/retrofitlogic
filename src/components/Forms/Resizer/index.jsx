import { useRecoilState } from "recoil";
import { $Resizer } from "../../../store";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { FormContext } from "@/Apps/Aircraft_Forms/FormContext";

export default function Resizer() {
  const { resizer: Resizer, setResizer } = useContext(FormContext);
  //    const [Resizer, setResizer] = useRecoilState($Resizer);
  const [alignment] = useState([
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
  ]);
  const [currentAlignment, setCurrentAlignment] = useState(0);

  const incrementSize = () => {
    let el = Resizer.element;
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      let currentStyle = window.getComputedStyle(el);
      let currentFontSize = +currentStyle.fontSize.split("px")[0];
      el.style.fontSize = currentFontSize + 1 + "px";
    }
  };

  const decrementSize = () => {
    let el = Resizer.element;
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      let currentStyle = window.getComputedStyle(el);
      let currentFontSize = +currentStyle.fontSize.split("px")[0];
      el.style.fontSize = currentFontSize - 1 + "px";
    }
  };

  const toggleBold = () => {
    let el = Resizer.element;
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      let currentStyle = window.getComputedStyle(el);
      let currentFontSize = +currentStyle.fontWeight;
      if (currentFontSize > 500) {
        el.style.fontWeight = 400;
      } else {
        el.style.fontWeight = 700;
      }
    }
  };

  const closeResizer = () => {
    let obj = {
      index: 0,
      el: null,
    };
    setResizer(obj);
  };

  const changeSizeTo = (event) => {
    let el = Resizer.element;
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      el.style.fontSize = event.target.value + "px";
    }
  };

  const changeAlign = () => {
    let newIcon = 0;
    if (currentAlignment == 3) {
      newIcon = 0;
    } else {
      newIcon = currentAlignment + 1;
    }
    setCurrentAlignment(newIcon);
    let newAl = alignment[newIcon].iconName.split("align-")[1];
    let el = Resizer.element;
    if (
      el.tagName.toLowerCase() == "input" ||
      el.tagName.toLowerCase() == "textarea"
    ) {
      el.style.textAlign = `${newAl}`;
    }
  };

  const [AllowedSizes] = useState([
    6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40,
  ]);

  return (
    <div
      className="col-12 p-1 animate__animated animate__fadeInRight"
      id="Resizer"
      onClick={(e) => {
        e.stopPropagation();
        closeResizer();
      }}
    >
      <div
        className=" content d-flex flex-column gap-2 animate__animated animate__fadeInRight"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="btn btn-warning" onClick={toggleBold}>
          B
        </button>
        <button className="btn btn-danger" onClick={decrementSize}>
          A-
        </button>
        <button className="btn btn-primary" onClick={incrementSize}>
          A+
        </button>
        <select className="form-select" onChange={changeSizeTo}>
          {AllowedSizes.map((size, index) => {
            return (
              <option key={index} value={size}>
                {size}
              </option>
            );
          })}
        </select>
        <FontAwesomeIcon
          className="icon"
          onClick={changeAlign}
          icon={alignment[currentAlignment]}
        />
      </div>
    </div>
  );
}
