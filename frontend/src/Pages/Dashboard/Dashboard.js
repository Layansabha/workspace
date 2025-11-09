import React from "react";
import Tasks from "./components/Taskss/Taskss";
import Points from "./components/Points/Points";
import Clock from "./components/Clock/Clock";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Award from "./components/Awards/Awards";
import Courses from "./components/Courses/Courses";
import Sidebar from "./components/Sidebar/Sidebar";

import "../Dashboard/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-grid">
        <div className="grid-item tasks">
          <Tasks />
        </div>

        <div className="grid-item points">
          <Points />
        </div>

        <div className="grid-item leaderboard">
          <Leaderboard />
        </div>

        <div className="grid-item clock">
          <Clock />
        </div>

        <div className="grid-item courses">
          <Courses />
        </div>

        <div className="grid-item awards">
          <Award />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
