import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react"
import { useRecoilState } from "recoil";
import { $ActiveModal, $ModalData, $Server, $Token } from "@/store";

export default function ItemsFinder() {
    const [Server_Url] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setActiveModal] = useRecoilState($ActiveModal);
    const [ModalData, setModalData] = useRecoilState($ModalData);
    const [searchResult, setSearchResult] = useState([]);
    const [viewResult, setViewResult] = useState([]);
    const [searchValue, setSearchValue] = useState();

    const handelSearchValue = () => {
        let val = event.target.value;
        setSearchValue(val);
    }

    const handelSearch = () => {
        event.preventDefault();
        getSearchResults();
    }

    const openQtyModal = (product_id) => {
        let oldModalData = { ...ModalData };
        oldModalData.product_id = product_id;
        setActiveModal(6);
        setModalData(oldModalData);
    }

    function getSearchResults() {
        axios.post(`${Server_Url}/php/index.php/api/warehouse/products`, {
            search_value: searchValue,
            warehouse_id: 1,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((Res) => {
            let res = Res.data;
            console.log(res);
            if (!res.err) {
                setSearchResult(res.data);
            }
            else {
                setSearchResult([]);
                console.log("There is no products with that value");
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function changePage(pageIndex) {

    }

    const [pages, setPages] = useState([1, 2, 3, 4, 5]);
    const [activePage, setActivePage] = useState(0);

    return (
        <div className="ItemsFinder col-12">
            <form className="col-12 searchBar d-flex align-items-center p-3 gap-3" onSubmit={handelSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input className="form-control" placeholder="Find Items By P/N , Name or USA P/N" onKeyUp={handelSearchValue} />
                <button className="btn btn-danger">Search</button>
            </form>
            <div className="col-12 searchResults px-3">
                {
                    searchResult.length > 0 ? (
                        <React.Fragment>
                            <table className="col-12 table table-dark table-bordered table-hover" style={{ textAlign: "center", verticalAlign: "middel" }}>
                                <thead>
                                    <tr>
                                        <th>-</th>
                                        <th>Item P/N</th>
                                        <th>Item Name</th>
                                        <th>Item US P/N</th>
                                        <th>Item Total Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        searchResult.map((el, index) => {
                                            return (
                                                <tr key={index} onClick={() => { openQtyModal(el.product_id) }}>
                                                    <th>{index + 1}</th>
                                                    <th>{el.product_pn}</th>
                                                    <th>{el.product_name}</th>
                                                    <th>{el.product_usa_pn}</th>
                                                    <th>{el.total_qty}</th>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="col-12 pagination d-flex justify-content-center align-items-center gap-2">
                                {
                                    pages.map((p, index) => {
                                        return (
                                            <button key={index} onClick={() => { changePage(index) }} className={`btn ${index == activePage ? "btn-info" : "btn-primary"}`}>{p}</button>
                                        )
                                    })
                                }
                            </div>
                        </React.Fragment>
                    ) : null
                }

            </div>
        </div>
    )
}