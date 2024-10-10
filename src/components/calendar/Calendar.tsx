"use client";

import React, { useState } from "react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventDetails, setEventDetails] = useState({ title: "", time: "" });

  // Get days in current month
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleSubmitEvent = () => {
    setEvents({
      ...events,
      [selectedDay]: { title: eventDetails.title, time: eventDetails.time },
    });
    setShowModal(false);
    setEventDetails({ title: "", time: "" });
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(month, year);
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];

    // Create empty slots for days of the week before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="invisible"></div>);
    }

    // Create day cells for the current month
    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <div
          key={day}
          className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => handleDayClick(day)}
        >
          <span className="text-2xl font-bold">{day}</span>
          {/* Display event for this day */}
          {events[day] && (
            <div className="bg-yellow-500 text-white rounded mt-2 p-1">
              {events[day].title} - {events[day].time}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="main_container">
      <div className="flex flex-col max-w-2xl mx-auto mt-40">
        <div className="flex justify-between items-center p-4">
          <button
            className="bg-[#EFDACC] text-white px-4 py-2 rounded"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
              )
            }
          >
            Previous
          </button>
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </h2>
          <button
            className="bg-[#EFDACC] text-white px-4 py-2 rounded"
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-200 p-2 font-bold">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 p-4">{renderDays()}</div>

        {/* Modal for Adding Event */}
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4">
                Add Event for Day {selectedDay}
              </h3>
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                className="border p-2 rounded w-full mb-2"
                value={eventDetails.title}
                onChange={handleInputChange}
              />
              <input
                type="time"
                name="time"
                placeholder="Event Time"
                className="border p-2 rounded w-full mb-4"
                value={eventDetails.time}
                onChange={handleInputChange}
              />
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSubmitEvent}
                >
                  Save Event
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
