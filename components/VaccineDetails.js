import React, { useState } from 'react';

function VaccineDetails() {
  const [vaccine, setVaccine] = useState({
    vaccineName: '',
    content: '',
    mrp: '',
    buyingCost: '',
    sellingPrice: '',
    stockOnHand: '',
  });

  const handleChange = (e) => {
    setVaccine({ ...vaccine, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccine', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vaccine),
    });

    if (response.ok) {
      alert('Vaccine added successfully!');
      setVaccine({
        vaccineName: '',
        content: '',
        mrp: '',
        buyingCost: '',
        sellingPrice: '',
        stockOnHand: '',
      });
    } else {
      alert('Error adding vaccine');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Vaccine Name:</label>
            </td>
            <td>
              <input type="text" name="vaccineName" value={vaccine.vaccineName} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label>Content:</label>
            </td>
            <td>
              <input type="text" name="content" value={vaccine.content} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label>MRP:</label>
            </td>
            <td>
              <input type="text" name="mrp" value={vaccine.mrp} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label>Buying Cost:</label>
            </td>
            <td>
              <input type="text" name="buyingCost" value={vaccine.buyingCost} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label>Selling Price:</label>
            </td>
            <td>
              <input type="text" name="sellingPrice" value={vaccine.sellingPrice} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td>
              <label>Stock on Hand:</label>
            </td>
            <td>
              <input type="text" name="stockOnHand" value={vaccine.stockOnHand} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button type="submit">Add Vaccine</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

export default VaccineDetails;
