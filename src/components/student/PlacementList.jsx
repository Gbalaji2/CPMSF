import React from 'react';

const PlacementList = ({ placements }) => (
  <section className="placements">
    <h2>Company Placements</h2>
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Company</th>
          <th>Package (LPA)</th>
        </tr>
      </thead>
      <tbody>
        {placements.map((p, i) => (
          <tr key={i}>
            <td>{p.name}</td>
            <td>{p.company}</td>
            <td>{p.package}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default PlacementList;