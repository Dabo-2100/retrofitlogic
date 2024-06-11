import { faClock, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function UpperBar() {
  let date = new Date();
  const [ctime, setTime] = useState(
    date.toDateString() + " | " + date.toLocaleTimeString()
  );
  const UpdateTime = () => {
    date = new Date();
    setTime(date.toDateString() + " | " + date.toLocaleTimeString());
  };
  setInterval(UpdateTime);
  return (
    <div
      className="col-12 d-flex flex-row flex-nowrap justify-content-between align-items-center p-3"
      style={{
        backgroundColor: "#31404a",
        color: "rgba(255,255,255,.5)",
      }}
      id="UpperBar"
    >
      <div className="d-flex gap-2">
        <FontAwesomeIcon icon={faClock} />
        <p style={{ fontSize: "13px" }}>{ctime}</p>
      </div>
      <div className="d-flex gap-2">
        <FontAwesomeIcon icon={faGlobe} />
        <a
          href="https://ipacoconsult.com"
          target="_blank"
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,.5)",
            textDecoration: "none",
          }}
        >
          www.ipacoconsult.com
        </a>
      </div>
      <div className="d-flex gap-2">
        <FontAwesomeIcon icon={faEnvelope} />
        <a
          href="mailto:a_fattah_m@icloud.com"
          target="_blank"
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,.5)",
            textDecoration: "none",
          }}
        >
          Support : a_fattah_m@icloud.com
        </a>
      </div>
    </div>
  );
}
