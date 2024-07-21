import Form_1001 from "@/components/Forms/Form_1001";
import Form_1003 from "@/components/Forms/Form_1003";
import Form_1002 from "@/components/Forms/Form_1002";
import Resizer from "@/components/Forms/Resizer";
import Form_1003_B from "@/components/Forms/Form_1003_B";
import React, { useContext } from "react";
import { FormContext } from "./FormContext";
// import { useRecoilState } from "recoil";
// import { $ActiveForm, $ActiveModal, $Resizer } from "../../store";
import Swal from "sweetalert2";
export default function Form_Modal() {
  const { resizer, setActiveModal, activeForm, setActiveForm } =
    useContext(FormContext);
  const closeModal = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to close that form ?",
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes,close it",
      denyButtonText: "No !",
    }).then((res) => {
      if (res.isConfirmed) {
        setActiveModal(0);
        setActiveForm(0);
      }
    });
  };
  return (
    <div className="col-12 py-3" id="Form_Modal" onClick={closeModal}>
      {activeForm == 1001 ? <Form_1001 /> : null}
      {activeForm == 1002 ? <Form_1002 /> : null}
      {activeForm == 1003 ? <Form_1003 /> : null}
      {activeForm == 10030 ? <Form_1003_B /> : null}
      {resizer.index == 1 ? <Resizer /> : null}
    </div>
  );
}
