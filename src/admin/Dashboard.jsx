import { use, useEffect } from "react";
import Layout from "../components/global/Layout";
import { Link, useNavigate } from "react-router";

export default function Dashboard() {
  return (
    <Layout>
      <Link to="/" className="text-decoration-none text-primary position-absolute top-0" style={{marginTop: "27px"}}>
        <img src="/image/arrow-back.svg" width={25}/>
      </Link>

      <div className="mt-3">
        <h3>Dashboard</h3>
        <p className="mb-4">Pilih modul yang ingin dikelola:</p>

        <Link
          to="/admin/dashboard/users"
          className="btn d-block mb-2 btn-primary p-4"
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-people h4 m-0"></i>
            <span>Kelola Users</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/lessons"
          className="btn d-block mb-2 btn-success p-4"
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-book h4 m-0"></i>
            <span>Kelola Pelajaran</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/quizzes"
          className="btn d-block mb-3 btn-warning p-4"
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-question-circle h4 m-0"></i>
            <span>Kelola Quizzes</span>
          </div>
          
        </Link>
      </div>
    </Layout>
  );
}
