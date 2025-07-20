import React, { useState, useEffect } from 'react';


function Vaccine() {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      vaccineName: '',
      sellingPrice: '',
    });
  
    useEffect(() => {
      fetchData();
    }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccine', {
      method: 'POST',
    });
    const data = await response.json();
    setVaccines(JSON.parse(data));
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    const newVaccine = Object.fromEntries(formData.entries());
   // alert(JSON.stringify(newVaccine));
   console.log("saving"); 
    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccine', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVaccine),
    });

    if (response.ok) {
      fetchData();
      // Reset form data after successful submission
      setFormData({
        vaccineName: '',
        sellingPrice: '',
      });
      setLoading(false);
    } else {
      alert(`Error: ${response.status} - ${response.statusText}`);
      setLoading(false);
    }
    
  };

  return (
    <div>
      <div className="list">
        <h4>Vaccine List {loading && <div className="spinner">Loading...</div>}</h4>
        <div className="item">
          <strong>Name</strong>
          <strong>Selling Price</strong>
        </div>
        {vaccines.map((vaccine) => (
          <div key={vaccine.vaccineName} className="item">
            <span>{vaccine.vaccineName}</span>
            <span>{vaccine.sellingPrice}</span>
          </div>
        ))}
      </div>
      {loading && <div className="spinner">Loading...</div>}
      <form onSubmit={handleSubmit} className="list">
        <h4>New Vaccine</h4>
        <div className="item">
          <label>
            Name: &nbsp;
            <input
              type="text"
              name="vaccineName"
              value={formData.vaccineName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Selling Price:&nbsp;
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit"><i className="fas fa-duotone fa-floppy-disk"></i> Add Vaccine</button>
        </div>
      </form>
    </div>
  );
  
}

export default Vaccine;
