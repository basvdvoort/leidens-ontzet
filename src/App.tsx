import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Timetable from './components/Timetable';
import AdminPanel from './components/AdminPanel';
import { Performance, Venue, DayData } from './types';
import { venues, daysData } from './data';

function App() {
  const [performances, setPerformances] = useState<DayData[]>(daysData);

  const addPerformance = (performance: Performance) => {
    setPerformances((prevDays) => {
      const dayIndex = prevDays.findIndex(
        (day) =>
          day.date.toDateString() === performance.startTime.toDateString()
      );
      if (dayIndex !== -1) {
        const updatedDays = [...prevDays];
        updatedDays[dayIndex] = {
          ...updatedDays[dayIndex],
          performances: [...updatedDays[dayIndex].performances, performance],
        };
        return updatedDays;
      }
      return prevDays;
    });
  };

  const addVenue = (venue: Venue) => {
    // This function is not implemented as we're using a static list of venues
    console.log('Adding venue:', venue);
  };

  return (
    <Router>
      <div className="min-h-screen bg-red-50 text-red-900">
        <header className="bg-red-600 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Optredens Leidens Ontzet</h1>
            <div>
              <Link to="/" className="mr-4 hover:underline">
                Timetable
              </Link>
              <Link to="/admin" className="hover:underline">
                Beheer
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={<Timetable daysData={performances} venues={venues} />}
            />
            <Route
              path="/admin"
              element={
                <AdminPanel
                  addPerformance={addPerformance}
                  addVenue={addVenue}
                  venues={venues}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
