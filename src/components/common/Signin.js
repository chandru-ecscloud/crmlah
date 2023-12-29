import React, { useState } from 'react';
import HeroImage from "../../assets/heroImage.png"

const Form1 = () => (
  <div>
    
    <div className="col-lg-6 col-md-6 col-12">
      <form>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="companyName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="companyName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="companyName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="companyName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="companyName"
          />
        </div>
        <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Submit</button>
      </form>
    </div>
  </div>
);

const Form2 = () => (
  <div>
    <h2>Form 2</h2>
    <div className="col-lg-6 col-md-6 col-12">
      <form>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            className="form-control mt-3"
            id="fullName"
          />
        </div>
        <button className="contactsubmitBtn btn btn-danger mt-3" type="button">Submit</button>
      </form>
    </div>
  </div>
);

const RadioFormSelector = () => {
  const [selectedForm, setSelectedForm] = useState('form1');

  return (
    <div style={{ marginTop: "105px", backgroundColor: '#fff' }}>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-md-6 col-12 d-flex align-items-center justify-content-center'>
            <img src={HeroImage} alt="CRMLAH" className="img-fluid" />
          </div>
          <div className='col-lg-6 col-md-6 col-12'>
            <label>
              <input
                type="radio"
                value="form1"
                checked={selectedForm === 'form1'}
                onChange={() => setSelectedForm('form1')}
              />
              Company 
            </label>

            <label>
              <input
                type="radio"
                value="form2"
                checked={selectedForm === 'form2'}
                onChange={() => setSelectedForm('form2')}
              />
              Individuals
            </label>

            {selectedForm === 'form1' && <Form1 />}
            {selectedForm === 'form2' && <Form2 />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioFormSelector;
