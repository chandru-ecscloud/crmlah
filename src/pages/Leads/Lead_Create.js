import React from 'react';

function Lead_Create() {
  return (
    <section className='createLead'>
      <div className='container-fluid mt-3'>
        <div className='row'>
          <div className='col-lg-6 col-md-6 col-12'>
            <h5>Create Lead</h5>
          </div>
          <div className='col-lg-6 col-md-6 col-12 d-flex justify-content-end'>
            <button className='btn btn-danger'>Cancel</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button className='btn btn-primary'>Save</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Lead_Create;