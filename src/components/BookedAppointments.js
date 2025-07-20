import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

function BookedAppointments(props) {
  const [bookedAppointments, setBookedAppointments] = useState({});

  useEffect(() => {
    // Set up the request body
    const requestBody = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(1, 'days').format('YYYY-MM-DD')
    };
  
    // Make the API call with the request body
    axios.post('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/doctoravailability', requestBody)
      .then(response => {
        setBookedAppointments(response.data.appointments);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  // Render the table
  // Helper to obfuscate phone number
  const obfuscatePhone = (phone) => {
    if (!phone) return '';
    const last4 = phone.slice(-4);
    return `${'*'.repeat(Math.max(0, phone.length - 4))}${last4}`;
  };
  return (
    <div><h2>Booked Appointments</h2>
    <table className="booked-appointments">
      <thead>
        <tr>
          <th>{moment().format('dddd, MMMM D')}</th>
          <th>{moment().add(1, 'days').format('dddd, MMMM D')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {bookedAppointments[moment().format('YYYY-MM-DD')] ? (
              <ul>
                {bookedAppointments[moment().format('YYYY-MM-DD')].map(appointment => (
                  <li key={appointment.appointmentTime}>
                    {appointment.appointmentTime} - {obfuscatePhone(appointment.patientPhone)} : {appointment.patientName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appointments booked</p>
            )}
          </td>
          <td>
            {bookedAppointments[moment().add(1, 'days').format('YYYY-MM-DD')] ? (
              <ul>
                {bookedAppointments[moment().add(1, 'days').format('YYYY-MM-DD')].map(appointment => (
                  <li key={appointment.appointmentTime}>
                    {appointment.appointmentTime} - {obfuscatePhone(appointment.patientPhone)} : {appointment.patientName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appointments booked</p>
            )}
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}

export default BookedAppointments;
