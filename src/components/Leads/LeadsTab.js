import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Table, Form } from 'react-bootstrap';

const data = [
    { id: 1, name: 'Suriya', company: 'CloudECS', email: 'suriya@example.com', phone: 9632587410, lead: 'stark' },
    { id: 2, name: 'Chandru', company: 'ECSCloud', email: 'Chandru@example.com', phone: 9658741235, lead: 'stark' },
    { id: 3, name: 'John Doe', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 4, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 5, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 6, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
];

const DataTable = ({ isSelectedAll, handleSelectAll, handleCheckboxChange, filteredData, sortColumn, sortDirection, handleSort }) => {
    return (
        <Table>
            <thead className="table-header">
                <tr>
                    <th>
                        <Form.Check
                            type="checkbox"
                            checked={isSelectedAll}
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th onClick={() => handleSort('name')}>Lead Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('company')}>Company {sortColumn === 'company' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('email')}>Email {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('phone')}>Phone Number {sortColumn === 'phone' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                    <th onClick={() => handleSort('lead')}>Lead Owner {sortColumn === 'lead' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item) => (
                    <tr key={item.id}>
                        <td>
                            <Form.Check
                                type="checkbox"
                                checked={isSelectedAll}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.company}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.lead}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

function LeadsTab() {
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSelectAll = () => {
        setIsSelectedAll(!isSelectedAll);
        setSelectedItems(isSelectedAll ? [] : data.map((item) => item.id));
    };

    const handleCheckboxChange = (itemId) => {
        const updatedSelectedItems = isSelectedAll
            ? selectedItems.filter((item) => item !== itemId)
            : [...selectedItems, itemId];

        setIsSelectedAll(updatedSelectedItems.length === data.length);
        setSelectedItems(updatedSelectedItems);
    };

    const handleSearch = (value) => {
        // Filter data based on the search term
        const result = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(result);
    };

    const handleSort = (column) => {
        // Sort the data based on the selected column
        const direction = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        const sortedData = [...filteredData].sort((a, b) => {
            const valueA = a[column].toLowerCase();
            const valueB = b[column].toLowerCase();

            if (direction === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });

        setFilteredData(sortedData);
    };

    return (
        <section className='leadsTab' style={{ marginTop: '105px' }}>
            <div className='container-fluid py-3'>
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-12'>
                        <input
                            type="text"
                            placeholder="Search.."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleSearch(e.target.value);
                            }}
                        />
                        <p className='mt-3'><b>Total Records: {filteredData.length}</b></p>
                    </div>
                    <div className='col-lg-6 col-md-6 col-12'>
                        <div className="dropdown d-flex flex-column align-items-end">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Create Lead
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <a className="dropdown-item" href="/lead">Action</a>
                                <a className="dropdown-item" href="/lead">Another action</a>
                                <a className="dropdown-item" href="/lead">Something else here</a>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-lg-10 col-md-10 col-12 d-flex flex-column align-items-end'>
                                <FaEdit className='editIcon' size={38} />
                            </div>
                            <div className='col-lg-2 col-md-2 col-12 d-flex flex-column align-items-end'>
                                <div className="dropdown">
                                    <button className="actionBtn btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                        Actions
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                        <a className="dropdown-item" href="/lead">Action</a>
                                        <a className="dropdown-item" href="/lead">Another action</a>
                                        <a className="dropdown-item" href="/lead">Something else here</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <DataTable
                        isSelectedAll={isSelectedAll}
                        handleSelectAll={handleSelectAll}
                        handleCheckboxChange={handleCheckboxChange}
                        filteredData={filteredData}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                    />
                </div>
            </div>
        </section>
    );
}

export default LeadsTab;
