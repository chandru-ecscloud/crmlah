import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Form1 = () => (
    <div className='container'>
        <div className='row d-flex align-items-center justify-content-center'>
            <div className="card my-3" style={{ width: '25rem' }}>
                <div className="card-body">
                    <form>
                        <div className="form-group mt-3">
                            <label htmlFor="companyId">Company User Email:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="companyId"
                                placeholder='Enter User Email'
                            />
                        </div>
                        <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Submit</button>
                        <p className='forgotWord text-center mt-2'>
                            Return to <Link to='/login' className='password-link'>Login</Link>?
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
);

const Form2 = () => (
    <div className='container'>
        <div className='row d-flex align-items-center justify-content-center'>
            <div className="card my-3" style={{ width: '25rem' }}>
                <div className="card-body">
                    <form>
                        <div className="form-group mt-3">
                            <label htmlFor="companyId">User Email:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="companyId"
                                placeholder='Enter User Email'
                            />
                        </div>
                        <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Submit</button>
                        <p className='forgotWord text-center mt-2'>
                            Return to <Link to='/forgot' className='password-link'>Login</Link>?
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
);

const RadioFormSelector = () => {
    const [selectedForm, setSelectedForm] = useState('form1');

    return (
        <div style={{ marginTop: "105px", backgroundColor: '#fff' }}>
            <div className='container'>
                <div className='row py-5'>
                    <h3 className='registerWord text-center'>FORGOT PASSWORD</h3>
                    <div className='col-lg-6 col-md-6 col-12 d-flex align-items-end justify-content-end mt-3'>
                        <label>
                            <input
                                type="radio"
                                value="form1"
                                checked={selectedForm === 'form1'}
                                onChange={() => setSelectedForm('form1')}
                            />
                            &nbsp;Company
                        </label>
                    </div>

                    <div className='col-lg-6 col-md-6 col-12 d-flex align-items-start justify-content-start mt-3'>
                        <label>
                            <input
                                type="radio"
                                value="form2"
                                checked={selectedForm === 'form2'}
                                onChange={() => setSelectedForm('form2')}
                            />
                            &nbsp;Individuals
                        </label>
                    </div>

                    {selectedForm === 'form1' && <Form1 />}
                    {selectedForm === 'form2' && <Form2 />}


                </div>
            </div>
        </div>
    );
};

export default RadioFormSelector;
