import React, { useState } from 'react';
import HeroImage from "../../assets/heroImage.png"

const Form1 = () => (
  <div>
    <form>
      <div className="form-group mt-3">
        <label htmlFor="companyName">Company Name:</label>
        <input
          type="text"
          className="form-control"
          id="companyName"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="companyUsername">Company Username:</label>
        <input
          type="text"
          className="form-control"
          id="companyUsername"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="companyPassword">Company Password:</label>
        <input
          type="text"
          className="form-control"
          id="companyPassword"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="companyMail">Company Mail:</label>
        <input
          type="text"
          className="form-control"
          id="companyMail"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="companyPhone">Company Phone:</label>
        <input
          type="text"
          className="form-control"
          id="companyPhone"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="companyAddress">Company Address:</label>
        <input
          type="text"
          className="form-control"
          id="companyAddress"
        />
      </div>
      <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Register</button>
    </form>
  </div>
);

const Form2 = () => (
  <div>
    <form>
      <div className="form-group mt-3">
        <label htmlFor="Name">Name:</label>
        <input
          type="text"
          className="form-control"
          id="Name"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="Password">Password:</label>
        <input
          type="text"
          className="form-control"
          id="Password"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="Mail">Mail:</label>
        <input
          type="text"
          className="form-control"
          id="Mail"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="Phone">Phone:</label>
        <input
          type="text"
          className="form-control"
          id="Phone"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="Address">Address:</label>
        <input
          type="text"
          className="form-control"
          id="Address"
        />
      </div>
      <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Register</button>
    </form>
  </div>
);

const RadioFormSelector = () => {
  const [selectedForm, setSelectedForm] = useState('form1');

  return (
    <div style={{ marginTop: "105px", backgroundColor: '#fff' }}>
      <div className='container'>
        <div className='row py-5'>
          <div className='col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center'>
            <img src={HeroImage} alt="CRMLAH" className="img-fluid" />
          </div>
          <div className='col-lg-6 col-md-6 col-12'>
            <div className='row'>
              <h3 className='registerWord text-center'>REGISTER FORM</h3>
              <div className='col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center'>
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

              <div className='col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center'>
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
      </div>
    </div>
  );
};

export default RadioFormSelector;
