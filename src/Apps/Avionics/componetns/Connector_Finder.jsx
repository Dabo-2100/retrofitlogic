import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { $Server, $Token, $LoaderIndex } from "@/store";
import { useRecoilState } from "recoil";

export default function Connector_Finder() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex)
    const connector_name = useRef();
    const [res, setRes] = useState([]);
    const [fIndex, setFIndex] = useState(0);
    const handleSubmit = () => {
        event.preventDefault();
        setLoaderIndex(1);
        axios.post(`${Server_Url}/php/index.php/api/connectors/search`, {
            connector_name: connector_name.current.value,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;

            if (!res.err) {
                setRes(res.data);
            }
            else {
                setRes([]);
            }
            setFIndex(1);
            setLoaderIndex(0);
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div className="col-12 d-flex flex-wrap p-4 pt-0 gap-3" id="Connector_Finder">
            <p className="header col-12">Connector Finder</p>
            <form className="col-12 d-flex gap-3" onSubmit={handleSubmit}>
                <input className="form-control" ref={connector_name} type="text" placeholder="Enter Connector P/N" />
                <button className="col-3 btn btn-primary">Find it</button>
            </form>
            {
                (res.length != 0) ? (
                    <table className="table table-dark table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>P/N</th>
                                <th>Connector Type</th>
                                <th>Task Name</th>
                                <th>SB Part</th>
                                <th>Task Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                res.map((connector, index) => {
                                    console.log(connector);
                                    return (
                                        <>
                                            <tr key={index} style={{ borderTop: "3px solid rgb(77, 81, 84)" }}>
                                                <td rowSpan={connector.sb_tasks.length + 1}>{index + 1}</td>
                                                <td rowSpan={connector.sb_tasks.length + 1}>{connector.connector_name}</td>
                                                <td rowSpan={connector.sb_tasks.length + 1}>{connector.type_name}</td>
                                                {/* <td  colSpan={3}>Related Tasks No : {connector.sb_tasks.length}</td> */}
                                            </tr>
                                            {
                                                connector.sb_tasks.map((task, tIndex) => {
                                                    return (
                                                        <tr key={tIndex}>
                                                            <td>{task.task_name}</td>
                                                            <td>{task.part_name}</td>
                                                            <td>{task.task_type_name}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                ) : (
                    fIndex != 0 ? <p className="col-12 alert alert-danger">There is no connector found with That P/N</p> : null
                )
            }

        </div>
    )
}
