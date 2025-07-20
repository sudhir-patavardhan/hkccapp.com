import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserMd, faCalendarCheck, faCalendarDay, faUser, faCalendarTimes, faInbox } from '@fortawesome/free-solid-svg-icons';

function BookedAppointments(props) {
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add(2, 'days').format('YYYY-MM-DD');
    const requestBody = {
      startDate,
      endDate
    };
    axios.post('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/doctoravailability', requestBody)
      .then(response => {
        const { appointments, reminders } = response.data;
        const days = [0, 1, 2].map(i => moment().add(i, 'days').format('YYYY-MM-DD'));
        const dataByDate = {};
        days.forEach(date => {
          dataByDate[date] = {
            appointments: appointments[date] || [],
            reminders: reminders.filter(r => r.reminderDate === date)
          };
        });
        setCalendarData(dataByDate);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const obfuscatePhone = (phone) => {
    if (!phone) return '';
    if (props.authenticated) return phone;
    const last4 = phone.slice(-4);
    return `${'*'.repeat(Math.max(0, phone.length - 4))}${last4}`;
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'nextVisit':
        return <FontAwesomeIcon icon={faBell} title="Next Visit Reminder" className="reminder-icon next-visit" />;
      case 'invoicePayment':
        return <FontAwesomeIcon icon={faCalendarCheck} title="Invoice Payment" className="reminder-icon invoice-payment" />;
      case 'procureVaccine':
        return <FontAwesomeIcon icon={faUserMd} title="Procure Vaccine" className="reminder-icon procure-vaccine" />;
      default:
        return <FontAwesomeIcon icon={faBell} title={type} className="reminder-icon" />;
    }
  };

  const days = [0, 1, 2].map(i => moment().add(i, 'days'));

  return (
    <div className="calendar-container-flex">
      <h2 className="calendar-title"><FontAwesomeIcon icon={faCalendarDay} /> Clinic Calendar (Next 3 Days)</h2>
      <div className="calendar-days-flex">
        {days.map(day => {
          const dateStr = day.format('YYYY-MM-DD');
          const dayData = calendarData[dateStr] || { appointments: [], reminders: [] };
          const isToday = day.isSame(moment(), 'day');
          return (
            <div key={dateStr} className={`calendar-day-card-flex${isToday ? ' today' : ''}`}>
              <div className="calendar-day-header-flex">
                {day.format('dddd, MMM D')}
                {isToday && <span className="calendar-today-label">(Today)</span>}
              </div>
              <div className="calendar-section-flex appointments-section-flex">
                <div className="calendar-section-title-flex appointments-title-flex">
                  <FontAwesomeIcon icon={faUserMd} className="section-icon appointments-icon" /> Appointments
                </div>
                {dayData.appointments.length > 0 ? (
                  <ul className="calendar-list-flex appointments-list-flex">
                    {dayData.appointments.map((appt, idx) => (
                      <li key={appt.appointmentTime + appt.patientPhone + idx} className="calendar-list-item-flex appointment-item-flex">
                        <span className="badge time-badge">{appt.appointmentTime}</span>
                        <span className="appointment-patient"><FontAwesomeIcon icon={faUser} className="patient-icon" /> <b>{appt.patientName}</b></span>
                        <span className="appointment-phone" title={props.authenticated ? appt.patientPhone : ''}>{obfuscatePhone(appt.patientPhone)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="calendar-empty-flex"><FontAwesomeIcon icon={faCalendarTimes} /> No appointments</div>
                )}
              </div>
              <div className="calendar-section-flex reminders-section-flex">
                <div className="calendar-section-title-flex reminders-title-flex">
                  <FontAwesomeIcon icon={faBell} className="section-icon reminders-icon" /> Reminders
                </div>
                {dayData.reminders.length > 0 ? (
                  <ul className="calendar-list-flex reminders-list-flex">
                    {dayData.reminders.map((rem, idx) => (
                      <li key={rem.reminderType + rem.phoneAndPatientName + idx} className={`calendar-list-item-flex reminder-item-flex ${rem.reminderType}-reminder`}>
                        <span className="badge reminder-badge">{getReminderIcon(rem.reminderType)}</span>
                        <span className="reminder-patient"><b>{rem.patientName || rem.phoneAndPatientName}</b></span>
                        {rem.phone && (
                          <span className="reminder-phone" title={props.authenticated ? rem.phone : ''}>({obfuscatePhone(rem.phone)})</span>
                        )}
                        {rem.lastVisitDate && (
                          <span className="reminder-last-visit">Last Visit: {rem.lastVisitDate}</span>
                        )}
                        {rem.lastVisitReason && (
                          <span className="reminder-last-reason">Reason: {rem.lastVisitReason}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="calendar-empty-flex"><FontAwesomeIcon icon={faInbox} /> No reminders</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookedAppointments;
