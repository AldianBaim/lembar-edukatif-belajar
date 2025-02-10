import { use, useEffect } from "react";
import Layout from "../components/global/Layout";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <Layout>
      <Link to="/" className="text-decoration-none text-primary mb-1">
        <div>&larr; Kembali</div>
      </Link>
      <h2>Dashboard</h2>
      <p>Pilih modul yang ingin dikelola:</p>

      <Link to="/users" className="btn d-block mb-2 btn-primary">
        Kelola Users
      </Link>
      <Link to="/lessons" className="btn d-block mb-2 btn-success">
        Kelola Lessons
      </Link>
      <Link
        to="/admin/dashboard/quizzes"
        className="btn d-block mb-2 btn-warning"
      >
        Kelola Quizzes
      </Link>
    </Layout>
  );
}
