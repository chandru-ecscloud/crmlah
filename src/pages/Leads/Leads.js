import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Table, Form } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import { Link } from 'react-router-dom';

const data = [
    { id: 1, name: 'Suriya', company: 'CloudECS', email: 'suriya@example.com', phone: 9632587410, lead: 'stark' },
    { id: 2, name: 'Chandru', company: 'ECSCloud', email: 'Chandru@example.com', phone: 9658741235, lead: 'stark' },
    { id: 3, name: 'John Doe', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 4, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 5, name: 'Gayathri', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 6, name: 'Saravanan', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 7, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 8, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 9, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 10, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 11, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 12, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 13, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 14, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 15, name: 'Jane Smith', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
    { id: 16, name: 'Poongodi', company: 'ECSCloud', email: 'jane.smith@example.com', phone: 9658741235, lead: 'stark' },
];

const ITEMS_PER_PAGE = 7;

const DataTable = ({ isSelectedAll, selectedItems, handleSelectAll, handleCheckboxChange, filteredData, sortColumn, sortDirection, handleSort, currentPage, setCurrentPage }) => {
    const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === 'asc') {
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
        } else {
            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
        }

        return 0;
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    return (
        <>
            <Table>
                <thead className="table-header">
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={isSelectedAll}
                                onChange={() => handleCheckboxChange('all')}
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
                    {currentData.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={isSelectedAll || selectedItems.includes(item.id)}
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
            <div className='row'>
                <div className='col-lg-10 col-md-10 col-12 d-flex align-items-end justify-content-end'>
                    <div className="page-size-dropdown">
                        <span>Page Size: &nbsp;</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
                <div className='col-lg-2 col-md-2 col-12 d-flex align-items-start justify-content-start'>
                    <div className='pagination d-flex justify-content-end'>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <IoIosArrowBack />
                        </button>
                        <span>{`Page ${currentPage}`}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={endIndex >= filteredData.length}
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                </div>
            </div>


        </>
    );
};

function Leads() {
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSelectAll = () => {
        setIsSelectedAll(!isSelectedAll);
        setSelectedItems(isSelectedAll ? [] : data.map((item) => item.id));
    };

    const handleCheckboxChange = (itemId) => {
        if (itemId === 'all') {
            const updatedSelectedItems = isSelectedAll ? [] : data.map((item) => item.id);
            setIsSelectedAll(!isSelectedAll);
            setSelectedItems(updatedSelectedItems);
        } else {
            const updatedSelectedItems = isSelectedAll
                ? selectedItems.filter((item) => item !== itemId)
                : selectedItems.includes(itemId)
                    ? selectedItems.filter((item) => item !== itemId)
                    : [...selectedItems, itemId];

            setIsSelectedAll(updatedSelectedItems.length === data.length);
            setSelectedItems(updatedSelectedItems);
        }
    };




    const handleSearch = (value) => {
        const result = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(result);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        setSortColumn(column);
        setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        setCurrentPage(1);
    };

    return (
        <section className="leadsTab" style={{ marginTop: '20px' }}>
            <div className="container-fluid py-3">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                        <input
                            type="text"
                            placeholder="Search.."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleSearch(e.target.value);
                            }}
                        />
                        <p className="mt-3"><b>Total Records: {filteredData.length}</b></p>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="dropdown d-flex flex-column align-items-end">
                                <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Create Lead
                                </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <a className="dropdown-item" href="/createlead">Create Lead</a>
                                <a className="dropdown-item" href="/lead">Another action</a>
                                <a className="dropdown-item" href="/lead">Something else here</a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-10 col-md-10 col-12 d-flex flex-column align-items-end">
                                <FaEdit className="editIcon" size={38} />
                            </div>
                            <div className="col-lg-2 col-md-2 col-12 d-flex flex-column align-items-end">
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
                <div className="mt-3">
                    <DataTable
                        isSelectedAll={isSelectedAll}
                        selectedItems={selectedItems}
                        handleSelectAll={handleSelectAll}
                        handleCheckboxChange={handleCheckboxChange}
                        filteredData={filteredData}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </section>
    );
}

export default Leads;
