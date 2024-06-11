import AircraftConnectors from "./componetns/AircraftConnectors";
import Connector_Finder from "./componetns/Connector_Finder";
import "./index.scss";
export default function Avionics() {
    return (
        <div className="col-12 workingTab" id="Avionics">
            <AircraftConnectors />
            <Connector_Finder />
        </div>
    )
}
