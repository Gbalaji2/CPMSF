import React from 'react';

const Achievements = ({ data }) => {
  return (
    <section className="achievements">
      <h2>Student Achievements</h2>
      <ul>
        {data.map((student, index) => (
          <li key={index}>
            <strong>{student.name}</strong> - {student.company} - ₹{student.package} LPA
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Achievements;