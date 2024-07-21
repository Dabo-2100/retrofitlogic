import { createContext, useState } from "react";
const ReportContext = createContext();

const ReportProvider = ({ children }) => {
  const [detailsModal, setDetailsModal] = useState({
    index: false,
    part_id: 0,
  });

  return (
    <ReportContext.Provider
      value={{
        detailsModal,
        setDetailsModal,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export { ReportContext, ReportProvider };
