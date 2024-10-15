import React, { useState } from 'react';
import { Performance, Venue } from '../types';
import { daysData } from '../data';

interface AdminPanelProps {
  addPerformance: (performance: Performance) => void;
  addVenue: (venue: Venue) => void;
  venues: Venue[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  addPerformance,
  addVenue,
  venues,
}) => {
  const [venueName, setVenueName] = useState('');
  const [performanceName, setPerformanceName] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    daysData[0].date.toISOString().split('T')[0]
  );

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (venueName) {
      addVenue({ id: Date.now().toString(), name: venueName });
      setVenueName('');
    }
  };

  const handleAddPerformance = (e: React.FormEvent) => {
    e.preventDefault();
    if (performanceName && selectedVenue && startTime && endTime) {
      const [startDate, endDate] = [
        new Date(selectedDate + 'T' + startTime),
        new Date(selectedDate + 'T' + endTime),
      ];

      // Adjust for times after midnight
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      addPerformance({
        id: Date.now().toString(),
        name: performanceName,
        venueId: selectedVenue,
        startTime: startDate,
        endTime: endDate,
      });
      setPerformanceName('');
      setSelectedVenue('');
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Beheer</h2>
      <form onSubmit={handleAddVenue} className="mb-6">
        <h3 className="font-semibold mb-2">Voeg Locatie Toe</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="Locatie naam"
            className="flex-grow p-2 border border-red-300 rounded"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Toevoegen
          </button>
        </div>
      </form>
      <form onSubmit={handleAddPerformance}>
        <h3 className="font-semibold mb-2">Voeg Optreden Toe</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={performanceName}
            onChange={(e) => setPerformanceName(e.target.value)}
            placeholder="Optreden naam"
            className="w-full p-2 border border-red-300 rounded"
          />
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="w-full p-2 border border-red-300 rounded"
          >
            <option value="">Selecteer locatie</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-red-300 rounded"
          >
            {daysData.map((day) => (
              <option
                key={day.date.toISOString()}
                value={day.date.toISOString().split('T')[0]}
              >
                {day.date.toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-red-300 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-red-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Optreden Toevoegen
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
