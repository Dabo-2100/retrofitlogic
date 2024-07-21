import { useRecoilState } from "recoil";
import { $openedAircraft_id, $LoaderIndex } from "@/store";
import { useContext, useEffect, useState } from "react";
import icon1001 from "@/assets/1001_icon.png";
import newDocIcon from "@/assets/new-document.png";
import Swal from "sweetalert2";
import { db } from "@/Firebase";
import { collection, getDocs, query, setDoc, doc } from "firebase/firestore";
import { $ActiveForm, $ActiveModal } from "@/store";
import { FormContext } from "../FormContext";

export default function FolderRoute() {
  // Utlities
  const makeSheetNo = (no) => {
    let L = String(no).length;
    let final = "";
    for (let index = 0; index < 4 - L; index++) {
      final += "0";
    }
    final += String(no);
    return final;
  };
  const sortNumbers = (arr) => {
    return arr.sort((a, b) => a - b);
  };
  const makeArr = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  // States
  const {
    activeAircraft: aircraft_id,
    setActiveModal: setOpenModal,
    setActiveForm: setOpenForm,
    forms1001,
    setForms1001,
    setFormData,
  } = useContext(FormContext);

  const [formsToView, setFormsToView] = useState([]);
  const [viewPerPage, setViewPerPage] = useState(5);
  const [pagesArr, setPagesArr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Functions
  const get1001Forms = async (aircraft_id) => {
    const Sheets = [];
    const querySnapshot = await getDocs(
      query(collection(db, `Aircrafts/${aircraft_id}/Form_1001`))
    );
    querySnapshot.forEach((doc) => {
      Sheets.push(makeSheetNo(doc.id));
    });
    setForms1001(sortNumbers(Sheets));
    setFormsToView(Sheets.slice(0, viewPerPage));
  };

  let addData = async () => {
    try {
      const docRef = await setDoc(doc(db, "Aircrafts", "49064/Form_1001/10"), {
        aircraft_type: "AW-149",
        mk_no: 12,
        is_active: true,
        sheet_no: "0003",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  // Use()
  useEffect(() => {
    get1001Forms(aircraft_id);
  }, []);
  useEffect(() => {
    setCurrentPage(1);
    let end = currentPage * viewPerPage;
    let start = end - viewPerPage;
    setFormsToView(forms1001.slice(start, end));
    setPagesArr(makeArr(1, Math.ceil(forms1001.length / viewPerPage)));
  }, [viewPerPage]);
  useEffect(() => {
    let end = currentPage * viewPerPage;
    let start = end - viewPerPage;
    setFormsToView(forms1001.slice(start, end));
  }, [currentPage]);
  // Return
  return (
    <div className="col-12 d-flex flex-wrap gap-3" id="FolderRoute">
      {/* <=========================== Actions ============================> */}
      <div className="col-12 d-flex justify-content-between text-white">
        <div className="d-flex align-items-center">
          <p className="">View Reslut / Page</p>
          <select
            defaultValue={5}
            onChange={(event) => {
              setViewPerPage(event.target.value);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div
          className="d-flex align-items-center"
          onClick={() => {
            setFormData({ sheet_no: makeSheetNo(forms1001.length + 1) });
            setOpenModal(1000);
            setOpenForm(1001);
          }}
        >
          <img height={30} src={newDocIcon} />
        </div>
      </div>
      {/* <=========================== Content ============================> */}
      <div className="col-12 d-flex gap-1 align-items-center">
        {formsToView.map((el, index) => {
          return (
            <div
              key={index}
              className="d-flex flex-column text-white align-items-center"
              onClick={() => {
                setFormData({ sheet_no: makeSheetNo(el) });
                setOpenModal(1000);
                setOpenForm(1001);
              }}
            >
              <img src={icon1001} height={100} />
              <p>{makeSheetNo(el)}</p>
            </div>
          );
        })}
      </div>
      {/* <=========================== Pagination ============================> */}
      <div className="col-12 d-flex gap-1 align-items-center align-content-center">
        {pagesArr.map((el, index) => {
          return (
            <button
              key={index}
              onClick={() => setCurrentPage(el)}
              className={`btn ${
                el == currentPage ? "btn-primary" : "btn-info"
              }`}
            >
              {el}
            </button>
          );
        })}
      </div>
    </div>
  );
}
