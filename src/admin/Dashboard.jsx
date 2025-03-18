import { use, useEffect } from "react";
import Layout from "../components/global/Layout";
import { Link, useNavigate } from "react-router";

export default function Dashboard() {
  return (
    <Layout>
      <Link to="/" className="text-decoration-none text-primary position-absolute top-0 ms-2" style={{marginTop: "27px"}}>
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>

      <div className="mt-3">
        <h3>Dashboard</h3>
        <p>Pilih modul yang ingin dikelola:</p>

        <Link
          to="/admin/dashboard/users"
          className="btn d-block mb-2 btn-primary"
        >
          Kelola Users
        </Link>
        <Link
          to="/admin/dashboard/lessons"
          className="btn d-block mb-2 btn-success"
        >
          Kelola Lessons
        </Link>
        <Link
          to="/admin/dashboard/quizzes"
          className="btn d-block mb-3 btn-warning"
        >
          Kelola Quizzes
        </Link>
      </div>
    </Layout>
  );
}
