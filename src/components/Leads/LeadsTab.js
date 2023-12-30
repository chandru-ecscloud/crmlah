import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../styles/custom.css';

function LeadsTab() {
    const columns = [
        {
            name: 'ID',
            selector: 'id',
            sortable: true,
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
        },
        {
            name: 'Age',
            selector: 'age',
            sortable: true,
        },
    ];

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const data = [
        {
            id: 1,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 2,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 3,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 4,
            name: 'gayathri',
            email: 'gayathri16@gmail.com',
            age: '25'
        },
        {
            id: 5,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 6,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 7,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '26'
        },
        {
            id: 8,
            name: 'saravanan',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
        {
            id: 9,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '30'
        },{
            id: 10,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },{
            id: 11,
            name: 'suresh',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },{
            id: 12,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },{
            id: 13,
            name: 'suriya',
            email: 'suriyasuresh8@gmail.com',
            age: '23'
        },
    ];

    const handleSearch = (text) => {
        const filteredItems = data.filter(
            (item) =>
                item.name.toLowerCase().includes(text.toLowerCase()) ||
                item.email.toLowerCase().includes(text.toLowerCase())
        );

        setSearchText(text);
        setFilteredData(filteredItems);
    };

    return (
        <div style={{ marginTop: '105px', backgroundColor: '#fff' }}>
            <div className="table-container">
                <DataTable
                    // title="Leads Data"
                    columns={columns}
                    data={searchText ? filteredData : data}
                    pagination
                    paginationPerPage={5}
                    subHeader
                    subHeaderComponent={
                        <div className='d-flex align-items-center justify-content-center'>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div style={{ marginLeft: '10px' }}>Total Rows: {searchText ? filteredData.length : data.length}</div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

export default LeadsTab;