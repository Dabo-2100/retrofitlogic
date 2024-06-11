import { useState } from 'react';
import ItemsFinder from './components/ItemsFinder';
import './index.scss';
import ItemForm from './components/ItemForm';
export default function Warehouse() {
    const [navTabs] = useState(["Find Items", "New Items", "Items Control"])
    const [activeTab, setActiveTab] = useState(0)
    const openTab = (tabIndex) => {
        setActiveTab(tabIndex);
    }
    return (
        <div className="col-12 workingTab animate__animated animate__fadeIn" id="Warehouse">
            <h1 className='col-12 fs-5 text-center p-3'>Efficiency at Every Turn "Streamlining Your Warehouse Operations"</h1>
            <nav className='col-12'>
                <ul className='col-12 d-flex gap-3' style={{ listStyle: 'none' }}>
                    {
                        navTabs.map((el, index) => {
                            return (
                                <li key={index} className={index == activeTab ? 'active' : null} onClick={() => { openTab(index) }}>{el}</li>
                            )
                        })
                    }
                </ul>
            </nav>
            {activeTab == 0 ? <ItemsFinder /> : null}
            {activeTab == 1 ? <ItemForm /> : null}
        </div>
    )
}