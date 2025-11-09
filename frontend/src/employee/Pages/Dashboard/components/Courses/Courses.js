import React from 'react';
import './Courses.css';




const Courses = () => {
  const courses = [
    {
      icon: 'C',
      title: 'UX Design',
      progress: 48,
      completed: 18,
      total: 40,
      color: '#1773eb',
      progressColor: '#FB03F5'
    },
    {
      icon: 'U',
      title: 'Visual Design',
      progress: 97,
      completed: 21,
      total: 23,
      color: '#7b1fa2',
      progressColor: '#00FF4F'
    },
    {
      icon: 'SK',
      title: 'Management',
      progress: 20,
      completed: 7,
      total: 35,
      color: '#000000',
      progressColor: '#FB035C'
    }
  ];

  return (
    <div className="courses-container">
      <div className="courses-header2">
        <div className="courses-title2">Courses In Progress</div>
      
      </div>
      
      {courses.map((course, index) => (
        <div key={index} className="course-item2">
          <div className="course-content2">
            <div 
              className="course-logo2" 
              style={{backgroundColor: course.color}}
            >
              {course.icon}
            </div>
            <div className="course-details2">
              <div className="course-header2">
                <span className="course-title2">{course.title}</span>
                <span className="course-progress">{course.progress}%</span>
              </div>
              <div className="progress-container2">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill2"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.progressColor
                    }}
                  ></div>
                </div>
                <div className="course-completion2">
                  {course.completed}/{course.total}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      ))}  <button className="view-all-btn">View All</button>
    </div>

  );
};

export default Courses;