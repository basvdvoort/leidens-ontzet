import React, { useEffect, useState } from 'react';
import { Performance, Venue, TimeSlot, DayData } from '../types';
import { Clock } from 'lucide-react';
import { timeSlots } from '../data';

interface TimetableProps {
  daysData: DayData[];
  venues: Venue[];
}

const Timetable: React.FC<TimetableProps> = ({ daysData, venues }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(daysData[0].date);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      // Set the date to the selected date to match the performance dates
      const simulatedTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        now.getHours(),
        now.getMinutes()
      );
      setCurrentTime(simulatedTime);
    };

    updateCurrentTime(); // Initial update
    const timer = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(timer);
  }, [selectedDate]);

  const getPositionForTime = (time: Date) => {
    let hours = time.getHours();
    const minutes = time.getMinutes();

    // Adjust for times after midnight
    if (hours < 13) {
      hours += 24;
    }

    const totalMinutes = (hours - 13) * 60 + minutes;
    const totalDuration = 13.5 * 60; // 13.5 hours from 13:00 to 02:30
    return (totalMinutes / totalDuration) * 100;
  };

  const renderTimeSlot = (slot: TimeSlot, index: number) => (
    <div
      key={index}
      className="text-center text-xs border-r border-red-200 py-1"
    >
      {slot.start}
    </div>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPerformance = (performance: Performance, venueId: string) => {
    if (performance.venueId !== venueId) return null;
    const startPosition = getPositionForTime(performance.startTime);
    const endPosition = getPositionForTime(performance.endTime);
    const width = endPosition - startPosition;

    return (
      <div
        key={performance.id}
        className="absolute h-full bg-red-300 text-xs p-1 overflow-hidden whitespace-nowrap border border-red-400 rounded"
        style={{
          left: `${startPosition}%`,
          width: `${width}%`,
        }}
        title={`${performance.name} (${formatTime(
          performance.startTime
        )} - ${formatTime(performance.endTime)})`}
      >
        <div className="font-bold">{performance.name}</div>
        <div className="text-[10px]">
          {formatTime(performance.startTime)} -{' '}
          {formatTime(performance.endTime)}
        </div>
      </div>
    );
  };

  const selectedDayData =
    daysData.find(
      (day) => day.date.toDateString() === selectedDate.toDateString()
    ) || daysData[0];

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <div className="mb-4">
        <select
          value={selectedDate.toISOString()}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="p-2 border border-red-300 rounded"
        >
          {daysData.map((day) => (
            <option key={day.date.toISOString()} value={day.date.toISOString()}>
              {day.date.toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="relative min-w-[1200px]">
        <div className="grid grid-cols-[auto,1fr] gap-2">
          <div className="font-bold">Locaties</div>
          <div className="grid grid-cols-27 gap-0">
            {timeSlots.map(renderTimeSlot)}
          </div>
          {venues.map((venue) => (
            <React.Fragment key={venue.id}>
              <div className="font-semibold py-2">{venue.name}</div>
              <div className="relative h-12 bg-red-100">
                {selectedDayData.performances.map((performance) =>
                  renderPerformance(performance, venue.id)
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div
          className="absolute top-8 bottom-0 w-px bg-red-600"
          style={{ left: `${getPositionForTime(currentTime)}%` }}
        >
          <Clock className="text-red-600 -ml-3 -mt-3" size={24} />
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Huidige tijd (gesimuleerd): {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Timetable;
