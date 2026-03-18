import React from "react";
import PublicNavbar from "../components/common/PublicNavbar";
import { Link } from "react-router-dom";

// Dummy data — existing data
const achievementsData = [
  { name: "Gowthambalaji", company: "TCS", package: 7, image: "gowthambalaji.jpg" },
  { name: "Karthik", company: "Infosys", package: 6, image: "karthik.jpg" },
  { name: "Anitha", company: "Wipro", package: 5.5, image: "anitha.jpg" },
  { name: "Rahul", company: "Accenture", package: 6.5, image: "rahul.jpg" },
  { name: "Priya", company: "Cognizant", package: 5, image: "priya.jpg" },
  { name: "Arjun", company: "Capgemini", package: 6, image: "arjun.jpg" },
  { name: "Sakthi", company: "HCL", package: 5.2, image: "sakthi.jpg" },
];

const commentsData = [
  { name: "Gowthambalaji", text: "The placement process was smooth and well organized.", image: "gowthambalaji.jpg" },
  { name: "Karthik", text: "I learned a lot during training sessions.", image: "karthik.jpg" },
  { name: "Anitha", text: "The guidance from mentors was excellent.", image: "anitha.jpg" },
  { name: "Rahul", text: "Very helpful and structured process.", image: "rahul.jpg" },
  { name: "Priya", text: "I got placed in my dream company!", image: "priya.jpg" },
  { name: "Arjun", text: "Supportive environment and good learning.", image: "arjun.jpg" },
  { name: "Sakthi", text: "Smooth interview experience and prompt feedback.", image: "sakthi.jpg" },
];

const placementsData = [
  { name: "Gowthambalaji", company: "TCS", package: 7 },
  { name: "Karthik", company: "Infosys", package: 6 },
  { name: "Anitha", company: "Wipro", package: 5.5 },
  { name: "Rahul", company: "Accenture", package: 6.5 },
  { name: "Priya", company: "Cognizant", package: 5 },
  { name: "Arjun", company: "Capgemini", package: 6 },
  { name: "Sakthi", company: "HCL", package: 5.2 },
];

// College history for timeline
const historyData = [
  { year: 2020, placed: 45, topCompanies: ["TCS", "Infosys", "Wipro"] },
  { year: 2021, placed: 52, topCompanies: ["Accenture", "Cognizant", "HCL"] },
  { year: 2022, placed: 60, topCompanies: ["Capgemini", "TCS", "Infosys"] },
  { year: 2023, placed: 65, topCompanies: ["Wipro", "Accenture", "HCL"] },
];

export default function Home() {
  return (
    <>
      <PublicNavbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <img
          src="/background.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-bold mb-6">
            College Placement Management System
          </h1>

          <p className="text-lg mb-8 max-w-xl text-center mx-auto">
            A platform for students and administrators to manage campus
            recruitment, job postings, and placement activities.
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <section id="achievements" className="py-16 bg-gradient-to-r from-blue-100 to-blue-200 text-center">
        <h2 className="text-4xl font-bold mb-12">Student Achievements</h2>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {achievementsData.map((student, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow flex flex-col items-center hover:scale-105 transition-transform">
              <img
                src={`/students/${student.image}`}
                alt={student.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{student.name}</h3>
              <p>Company: {student.company}</p>
              <p>Package: ₹{student.package} LPA</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-blue-50 text-center">
        <h2 className="text-4xl font-bold mb-12">Student Testimonials</h2>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {commentsData.map((c, i) => (
            <div key={i} className="p-6 border rounded-lg shadow flex flex-col items-center hover:scale-105 transition-transform">
              <img
                src={`/students/${c.image}`}
                alt={c.name}
                className="w-20 h-20 rounded-full mb-4 object-cover"
              />
              <p className="italic mb-2">"{c.text}"</p>
              <small className="block font-semibold">{c.name}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Placements Table Section */}
      <section id="placements" className="py-16 bg-blue-100 text-center">
        <h2 className="text-4xl font-bold mb-12">Company Placements</h2>
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-blue-200">
              <tr>
                <th className="border px-4 py-2">Student</th>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Package (LPA)</th>
              </tr>
            </thead>
            <tbody>
              {placementsData.map((p, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.company}</td>
                  <td className="border px-4 py-2">{p.package}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* College History Timeline Section */}
      <section id="history" className="py-16 bg-gray-100 text-center relative">
        <h2 className="text-4xl font-bold mb-12">Placement History by Year</h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-12 left-0 w-full h-1 bg-blue-300"></div>

          <div className="flex justify-between items-start relative z-10 flex-wrap gap-6">
            {historyData.map((year, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[180px] hover:scale-105 transition-transform"
              >
                {/* Circle on timeline */}
                <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-4 relative -top-6"></div>

                <h3 className="text-2xl font-semibold mb-2">{year.year}</h3>
                <p className="mb-2">Students Placed: {year.placed}</p>
                <p className="font-semibold mb-1">Top Companies:</p>
                <ul className="list-disc list-inside">
                  {year.topCompanies.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} College Placement Portal. All Rights Reserved.</p>
      </footer>
    </>
  );
}