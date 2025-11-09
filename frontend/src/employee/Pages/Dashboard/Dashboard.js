import React from "react";

// ملاحظة: لا تستوردي Sidebar هون. السايدبار لازم يجي من الـ Layout بس.
import Tasks from "./components/Taskss/Taskss";
import Points from "./components/Points/Points";
import Clock from "./components/Clock/Clock";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Award from "./components/Awards/Awards";
import Courses from "./components/Courses/Courses";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-wrap">
      <div className="dashboard-grid">
        <section className="card tasks">
          <Tasks />
        </section>
        <section className="card points">
          <Points />
        </section>
        <section className="card leaderboard">
          <Leaderboard />
        </section>
        <section className="card clock">
          <Clock />
        </section>
        <section className="card courses">
          <Courses />
        </section>
        <section className="card awards">
          <Award />
        </section>
      </div>
    </div>
  );
}
