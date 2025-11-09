import { Calendar } from "lucide-react";
import "./Assignments.css";

export default function Assignments() {
  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h1>Assignments</h1>
        <div className="due-date">
          <Calendar size={16} />
          <span>Due Date</span>
          <span>Oct 02, 2022</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="assignment-content">
        <h3>Assignment Q4</h3>
        <p>You have UI/UX Assignment</p>
      </div>
    </div>
  );
}