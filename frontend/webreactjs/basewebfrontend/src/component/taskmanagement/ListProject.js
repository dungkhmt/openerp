import React from "react";
import { Link } from "react-router-dom";
import AndroidIcon from '@mui/icons-material/Android';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ListProject() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const domain = "http://localhost:8080";
  useEffect(() => {
    axios.get("http://localhost:8080/api/projects", {
      auth: {
        username: "admin",
        password: "sscm@123456"
      }
    })
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
  }, []);
  return (
    <>
      <div className="pt-3 px-2">
        <div className="p-3" style={{ backgroundColor: "#FFF", boxShadow: "0 4px 8px rgba(0,0,0,0.07)" }}>
          <h3 className="mb-4">Danh sách dự án</h3>
          {loading && <p>Loading...</p>}
          {projects && projects.map((item) => (
            <div className="d-flex border rounder p-2 mb-4" style={{ borderRadius: "15px 15px", backgroundColor: "#EEE", boxShadow: "0 0 5px 0px" }} key={item.id}>
              <div className="fs-3 d-flex align-items-center p-3">
                <AccountTreeIcon />
              </div>
              <div className="d-flex flex-column flex-justify-content p-0">
                <Link to={`/taskmanagement/project/${item.id}/tasks`} className="text-decoration-none text-dark" ><h6>{item.name != null ? item.name : "Dự án chưa được đặt tên"}</h6></Link>
                <div>
                  <Link to="/taskmanagement/project/tasks/create" className="text-decoration-none me-3">Add issues</Link>
                  <Link to="#" className="text-decoration-none me-3">List Issues</Link>
                  <Link to="#" className="text-decoration-none me-3">Boards</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
