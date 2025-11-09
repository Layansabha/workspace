import React, { useEffect, useMemo, useState } from "react";
import "./HRDashboard.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000"; // غيّريه لو لازم

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [clockOutNote, setClockOutNote] = useState("");
  const [clockOutMessage, setClockOutMessage] = useState("");

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const [newEventType, setNewEventType] = useState("Birthday");
  const [newEventDate, setNewEventDate] = useState("");
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [customEvents, setCustomEvents] = useState({});
  const [allEmployees, setAllEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // demo data
  const offEmployees = useMemo(
    () => [
      {
        name: "Ahmed Ali",
        image: "/assets/user1.png",
        leavePeriod: "25 Oct - 27 Oct",
      },
      {
        name: "Sara Khaled",
        image: "/assets/user2.png",
        leavePeriod: "26 Oct - 28 Oct",
      },
      {
        name: "Mohammed Salem",
        image: "/assets/user3.png",
        leavePeriod: "25 Oct - 29 Oct",
      },
      {
        name: "Laila Omar",
        image: "/assets/user4.png",
        leavePeriod: "27 Oct - 30 Oct",
      },
    ],
    []
  );

  const pendingTimeOff = useMemo(
    () => [
      {
        name: "Yousef Hamed",
        image: "/assets/user5.png",
        reason: "Sick Leave",
      },
      {
        name: "Fatima Zaid",
        image: "/assets/user6.png",
        reason: "Unpaid Leave",
      },
    ],
    []
  );

  const pendingAttendance = useMemo(
    () => [
      { name: "Khalid Nasser", image: "/assets/user7.png", hoursWorked: 4 },
      { name: "Amina Sami", image: "/assets/user8.png", hoursWorked: 6 },
    ],
    []
  );

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchEvents().catch(console.error);
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // events
    const evRes = await fetch(`${API_BASE}/hr-manager/get-events`, { headers });
    if (!evRes.ok) return;

    const events = await evRes.json();
    const formatted = events.reduce((acc, event) => {
      const d = new Date(event.eventTime);
      const key = `${d.getDate()}-${d.getMonth()}`;
      if (!acc[key]) acc[key] = { Birthday: [], Anniversary: [] };
      if (event.eventType && acc[key][event.eventType]) {
        acc[key][event.eventType].push(
          event.employeeImage || "/assets/user1.png"
        );
      }
      return acc;
    }, {});
    setCustomEvents(formatted);

    // employees
    const empRes = await fetch(`${API_BASE}/hr-manager/get-employees`, {
      headers,
    });
    if (empRes.ok) setAllEmployees(await empRes.json());
  };

  const days = useMemo(() => {
    const out = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      const key = `${d.getDate()}-${d.getMonth()}`;
      out.push({
        label: `${d.toLocaleString("en", { weekday: "short" })} ${d.getDate()}`,
        events: customEvents[key] || { Birthday: [], Anniversary: [] },
      });
    }
    return out;
  }, [selectedDate, customEvents]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
    setIsDatePickerOpen(false);
  };

  const handleClockInOut = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date());
    } else {
      setClockOutTime(new Date());
      setShowClockOutModal(true);
    }
  };

  const workedTime = () => {
    if (!clockInTime || !clockOutTime) return { h: 0, m: 0, s: 0 };
    const diff = clockOutTime - clockInTime;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };

  const confirmClockOut = () => {
    const { h, m, s } = workedTime();
    setClockOutMessage(
      `You worked for ${h}h ${m}m ${s}s${
        clockOutNote ? ` — Note: "${clockOutNote}"` : ""
      }.`
    );
    setIsClockedIn(false);
    setClockInTime(null);
    setClockOutTime(null);
    setClockOutNote("");
    setShowClockOutModal(false);
  };

  const handleAddEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedEmployeeEmail)
      return alert("Please select an employee.");
    if (!newEventDate) return alert("Pick a date.");
    if (isAddingEvent) return;

    setIsAddingEvent(true);
    try {
      const res = await fetch(`${API_BASE}/hr-manager/add-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeEmail: selectedEmployeeEmail,
          eventType: newEventType,
          eventTime: newEventDate,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Add failed");

      setSuccessMessage("✅ Event added successfully!");
      setShowAddEventModal(false);
      await fetchEvents();
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (e) {
      alert(e.message || "Network error");
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedEmployeeEmail || !newEventDate)
      return alert("Missing info for deletion.");
    const res = await fetch(`${API_BASE}/hr-manager/delete-event`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        employeeEmail: selectedEmployeeEmail,
        eventType: newEventType,
        eventTime: newEventDate,
      }),
    });
    if (res.ok) {
      setShowAddEventModal(false);
      await fetchEvents();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="dashboard-container">
      {successMessage && <div className="success-alert">{successMessage}</div>}

      <div className="content-wrapper">
        {/* left column */}
        <div className="left-column">
          {/* events */}
          <div className="event-container">
            <div className="events-header">
              <h2>Upcoming Events</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  className="calendar-header"
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  📅{" "}
                  {`${selectedDate.getDate()} ${selectedDate.toLocaleString(
                    "en",
                    { month: "short" }
                  )}`}
                </button>
                <button
                  className="add-event-button"
                  onClick={() => setShowAddEventModal(true)}
                >
                  ⚙️ Manage Events
                </button>
              </div>
            </div>

            <div className="events-grid">
              {days.map((day, idx) => (
                <div key={idx} className="day-column">
                  <div className="day-label">{day.label}</div>

                  <div className="event-type-section">
                    <div className="event-row">
                      <span className="event-icon">🎂</span>
                      <div className="event-images">
                        {day.events.Birthday?.length ? (
                          <>
                            {day.events.Birthday.slice(0, 3).map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="Birthday"
                                className="employee-img"
                              />
                            ))}
                            {day.events.Birthday.length > 3 && (
                              <span className="more-employees">
                                +{day.events.Birthday.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-events">No birthdays</span>
                        )}
                      </div>
                    </div>

                    <div className="event-divider-horizontal" />

                    <div className="event-row">
                      <span className="event-icon">❤️</span>
                      <div className="event-images">
                        {day.events.Anniversary?.length ? (
                          <>
                            {day.events.Anniversary.slice(0, 3).map(
                              (img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt="Anniversary"
                                  className="employee-img"
                                />
                              )
                            )}
                            {day.events.Anniversary.length > 3 && (
                              <span className="more-employees">
                                +{day.events.Anniversary.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-events">No anniversaries</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="event-legend">
              <div className="legend-item">
                <span className="event-icon">🎂</span> Birthday
              </div>
              <div className="legend-item">
                <span className="event-icon">❤️</span> Anniversary
              </div>
            </div>
          </div>

          {/* pending */}
          <div className="pending-container">
            <div className="pending-header">
              <h2>
                Pending Approval{" "}
                <span className="clock-icon yellow-clock">⏰</span>
              </h2>
            </div>

            <div className="pending-content">
              {/* time off */}
              <div className="pending-left">
                <div className="pending-title-row">
                  <div className="pending-title">Time-off</div>
                </div>
                <div className="pending-count">
                  {pendingTimeOff.length} pending
                </div>

                <div className="pending-list">
                  {pendingTimeOff.map((emp, i) => (
                    <div key={i} className="pending-item">
                      <img
                        src={emp.image}
                        alt={emp.name}
                        className="pending-img"
                      />
                      <div className="pending-details">
                        <div className="pending-name">{emp.name}</div>
                        <div className="pending-reason">{emp.reason}</div>
                        <div className="approval-actions">
                          <button
                            className="approve-btn"
                            onClick={() => alert(`Approved: ${emp.name}`)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => alert(`Rejected: ${emp.name}`)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pending-divider" />

              {/* attendance */}
              <div className="pending-right">
                <div className="pending-title-row">
                  <div className="pending-title">Time Attendance</div>
                </div>
                <div className="pending-count">
                  {pendingAttendance.length} pending
                </div>

                <div className="pending-list">
                  {pendingAttendance.map((emp, i) => (
                    <div key={i} className="pending-item">
                      <img
                        src={emp.image}
                        alt={emp.name}
                        className="pending-img"
                      />
                      <div className="pending-details">
                        <div className="pending-name">{emp.name}</div>

                        <div className="attendance-bar-container">
                          <div
                            className="attendance-bar"
                            style={{ width: `${(emp.hoursWorked / 8) * 100}%` }}
                          />
                          <span className="attendance-text">
                            {emp.hoursWorked}h/8h
                          </span>
                        </div>

                        <div className="approval-actions">
                          <button
                            className="approve-btn"
                            onClick={() => alert(`Approved: ${emp.name}`)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => alert(`Rejected: ${emp.name}`)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="right-column">
          <div className="clock-container">
            <div className="clock-header">
              <h2>Clock In/Out</h2>
              <div className="current-time">
                {(clockInTime || currentTime).toLocaleTimeString()}{" "}
                {currentTime.toLocaleDateString()}
              </div>
            </div>

            <div className="clock-details">
              <div className="time-row">
                <span>First In</span>
                <span>
                  {clockInTime ? clockInTime.toLocaleTimeString() : "--:--:--"}
                </span>
              </div>
              <div className="time-row">
                <span>Last Out</span>
                <span>
                  {isClockedIn || !clockInTime
                    ? "--:--:--"
                    : new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <button
              className={`clock-button ${isClockedIn ? "clocked-in" : ""}`}
              onClick={handleClockInOut}
            >
              {isClockedIn ? (
                <>
                  Clock Out <span className="arrow left-arrow">▶</span>
                </>
              ) : (
                <>
                  Clock In <span className="arrow right-arrow">▶</span>
                </>
              )}
            </button>
          </div>

          <div className="off-container">
            <div className="off-header">
              <h2>Who’s Off Today</h2>
            </div>
            <div className="off-list">
              {offEmployees.slice(0, 3).map((emp, i) => (
                <div key={i} className="off-item">
                  <img src={emp.image} alt={emp.name} className="off-img" />
                  <div className="off-details">
                    <div className="off-name">{emp.name}</div>
                    <div className="off-period">{emp.leavePeriod}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="job-applications-container">
            <div className="job-applications-header">
              <h2>Job Applications</h2>
            </div>
            <div className="job-applications-list">
              {[
                {
                  name: "Omar Hassan",
                  job: "Software Engineer",
                  date: "25 Oct 2025",
                },
                {
                  name: "Noura Ahmed",
                  job: "HR Specialist",
                  date: "26 Oct 2025",
                },
                {
                  name: "Zaid Ibrahim",
                  job: "Marketing Manager",
                  date: "27 Oct 2025",
                },
              ].map((app, i) => (
                <div key={i} className="job-application-item">
                  <div className="job-application-icon">👤</div>
                  <div className="job-application-details">
                    <div className="job-application-name">{app.name}</div>
                    <div className="job-application-job">{app.job}</div>
                    <div className="job-application-date">{app.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* date picker */}
      {isDatePickerOpen && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setIsDatePickerOpen(false)}
          />
          <div className="date-picker-modal">
            <h3>Select a Date</h3>
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
            />
          </div>
        </>
      )}

      {/* add/manage event */}
      {showAddEventModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowAddEventModal(false)}
          />
          <div className="add-event-modal">
            <h3>Manage Event</h3>

            <label>
              Employee
              <select
                value={selectedEmployeeEmail}
                onChange={(e) => setSelectedEmployeeEmail(e.target.value)}
              >
                <option value="">-- Select --</option>
                {allEmployees.map((emp, i) => (
                  <option key={i} value={emp.email}>
                    {emp.name} - {emp.email}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Event Type
              <select
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
              >
                <option value="Birthday">🎂 Birthday</option>
                <option value="Anniversary">❤️ Anniversary</option>
              </select>
            </label>

            <label>
              Event Date
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
              />
            </label>

            <div className="modal-buttons">
              <button onClick={handleAddEvent} disabled={isAddingEvent}>
                {isAddingEvent ? "Adding..." : "Add"}
              </button>
              <button onClick={handleDeleteEvent}>Delete</button>
            </div>
          </div>
        </>
      )}

      {/* clock out modal */}
      {showClockOutModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowClockOutModal(false)}
          />
          <div className="clock-out-modal">
            <h3>Clock out at {clockOutTime.toLocaleTimeString()}</h3>
            <div className="total-time">
              <span className="clock-icon">⏰</span>
              <span>
                Your total working time: {workedTime().h}h {workedTime().m}m{" "}
                {workedTime().s}s
              </span>
            </div>
            <textarea
              className="note-input"
              placeholder="Note (optional)"
              value={clockOutNote}
              onChange={(e) => setClockOutNote(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowClockOutModal(false)}>
                Cancel
              </button>
              <button onClick={confirmClockOut}>Clock Out</button>
            </div>
          </div>
        </>
      )}

      {/* toast */}
      {clockOutMessage && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setClockOutMessage("")}
          />
          <div className="clock-out-message">{clockOutMessage}</div>
        </>
      )}
    </div>
  );
}
