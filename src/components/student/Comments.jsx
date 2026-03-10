import React from 'react';

const Comments = ({ comments }) => {
  return (
    <section className="comments">
      <h2>Student Testimonials</h2>
      {comments.map((c, i) => (
        <div key={i} className="comment-card">
          <p>"{c.text}"</p>
          <small>- {c.name}</small>
        </div>
      ))}
    </section>
  );
};

export default Comments;