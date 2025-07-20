import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

function BookedAppointments(props) {
  const [bookedAppointments, setBookedAppointments] = useState({});
  const [upcomingReminders, setUpcomingReminders] = useState([]);

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

    // Fetch visits for next 2 days for reminders
    const visitRequest = {
      phone:'', 
      patientName:'',
      startDate: moment().subtract(3, 'months').format('YYYY-MM-DD'),
      endDate: moment().add(2, 'days').format('YYYY-MM-DD')
    };
    axios.post('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/visit', visitRequest)
      .then(response => {
        let visits = [];
        try {
          visits = JSON.parse(response.data);
        } catch (e) {
          visits = [];
        }
        // Filter for nextVisitDate within next 2 days
        const today = moment();
        const in2days = moment().add(2, 'days');
        const reminders = visits.filter(v => v.nextVisitDate && moment(v.nextVisitDate, 'YYYY-MM-DD', true).isValid() && moment(v.nextVisitDate).isBetween(today, in2days, undefined, '[]'));
        setUpcomingReminders(reminders);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  // Render the table
  // Helper to obfuscate phone number
  const obfuscatePhone = (phone) => {
    if (!phone) return '';
    if (props.authenticated) return phone;
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
    <h2>Upcoming Visit Reminders (Next 2 Days)</h2>
    <table className="upcoming-reminders">
      <thead>
        <tr>
          <th>Patient Name</th>
          <th>Phone</th>
          <th>Next Visit Date</th>
        </tr>
      </thead>
      <tbody>
        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder, idx) => (
            <tr key={reminder.phone + reminder.patientName + reminder.nextVisitDate + idx}>
              <td>{reminder.patientName}</td>
              <td>{obfuscatePhone(reminder.phone)}</td>
              <td>{reminder.nextVisitDate}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={3}>No upcoming reminders</td></tr>
        )}
      </tbody>
    </table>
    </div>
  );
}

export default BookedAppointments;
