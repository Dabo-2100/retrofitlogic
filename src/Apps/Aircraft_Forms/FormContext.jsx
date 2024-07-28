import { createContext, useState } from "react";
const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [routes, setRoutes] = useState(["Home", "Aircrafts"]);
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeModal, setActiveModal] = useState(0);
  const [activeAircraft, setActiveAircraft] = useState(0);
  const [aircraftData, setAircraftData] = useState({});
  const [activeForm, setActiveForm] = useState(0);
  const [formData, setFormData] = useState({ sheet_no: false });
  const [forms1001, setForms1001] = useState([]);
  const [activeForms, setActiveForms] = useState({
    form_1001: null,
    form_1002: null,
    form_1003: null,
  });
  const [resizer, setResizer] = useState({
    index: 0,
    element: null,
  });

  return (
    <FormContext.Provider
      value={{
        routes,
        setRoutes,
        activeRoute,
        setActiveRoute,
        activeAircraft,
        setActiveAircraft,
        activeForm,
        setActiveForm,
        formData,
        setFormData,
        activeModal,
        setActiveModal,
        resizer,
        setResizer,
        aircraftData,
        setAircraftData,
        forms1001,
        setForms1001,
        activeForms,
        setActiveForms,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider };
