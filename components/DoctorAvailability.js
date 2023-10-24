import React, { useState, useEffect } from 'react';


const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const toggleSlot = async (weekday, slot, isAvailable) => {
    const method = isAvailable ? 'DELETE' : 'PUT';
    const url = isAvailable
        ? `https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/doctoravailability/${weekday}/${slot}`
        : 'https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/doctoravailability';



        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: !isAvailable ? JSON.stringify({ weekday, slot }) : undefined,
        });
        console.log('Status:', response.status);
        if (response.status === 204) {
            return true;
        } else if (!response.ok) {
            throw new Error('Error toggling slot');
        }

        console.log(response);
        return true;
    
};



const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i < 20; i++) {
        //if (i >= 14 && i < 18) { continue; }
        for (let j = 0; j < 60; j += 15) {
            const hour = i < 10 ? `0${i}` : i;
            const minute = j < 10 ? `0${j}` : j;
            slots.push(`${hour}:${minute}`);
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();

const DoctorAvailability = () => {
    const [slots, setSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const onSlotClick = async (weekday, slot) => {
        const isAvailable = slots.some((s) => s.weekday === weekday && s.slot === slot);
        toggleSlot(weekday, slot, isAvailable);

        setSlots((prevSlots) => {
            if (isAvailable) {
                return prevSlots.filter((s) => !(s.weekday === weekday && s.slot === slot));
            } else {
                return [...prevSlots, { weekday, slot }];
            }
        });

    };

    useEffect(() => {
        const fetchSlots = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/doctoravailability', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching slots');
                }
                const data = await response.json();
                setSlots(data.body);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Work Schedule</h2>
            <table className="calendar-table">
                <thead>
                    <tr>
                        <th>Weekday</th>
                        {timeSlots.map((slot, index) => (
                            <th key={index}>{slot}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weekdays.map((weekday) => (
                        <tr key={weekday}>
                            <td>{weekday}</td>
                            {timeSlots.map((slot, index) => {
                                const available = slots.some((s) => s.weekday === weekday && s.slot === slot);
                                return (
                                    <td
                                        key={index}
                                        className={available ? 'available-slot' : ''}
                                        onClick={() => onSlotClick(weekday, slot)}
                                    >
                                        {available ? '✓' : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default DoctorAvailability;
