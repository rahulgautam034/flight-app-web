import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo.jpeg";
import { dashboardArr } from "../components/navbar-items/navbar-items";
import { getUserDetails } from "../components/services/AccountService";

function NavBar() {
  const navigate = useNavigate();
  const [arr, setArr] = useState(dashboardArr);
  const [isUserLoggedIn, updateUSer] = useState(false);
  const [user, setUserDetails] = useState({});

  const navigateTo = (item) => {
    if (item.role) {
      localStorage.setItem("role", item.role);
    } else if (item.role === "ALL") {
      localStorage.setItem("role", item.role);
    }
    navigate(item.path);
  };

  const logout = () => {
    let txt = "";
    if (window.confirm(`Are you sure you want to Logout`)) {
      txt = "yes";
    } else {
      txt = "no";
    }

    if (txt === "no") {
      return;
    }

    localStorage.removeItem("account");
    localStorage.setItem("isUserAuthenticated", false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setArr(dashboardArr);
    updateUSer(false);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const newArr = JSON.parse(localStorage.getItem("navBarArr"));
    const isUser = localStorage.getItem("isUserAuthenticated");
    const user = getUserDetails();

    if (user && arr.length !== newArr.length) {
      setArr(newArr);
      updateUSer(isUser);
      setUserDetails(user);
    }
  });

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{
        height: "4rem",
        position: "fixed",
        width: "100%",
        overflow: "hidden",
        top: "0",
        zIndex: "1",
      }}
    >
      <div className="container-fluid">
        <img
          onClick={() =>
            user?.role === "ADMIN"
              ? navigate("/admin-dashboard")
              : navigate("/")
          }
          src={logo}
          style={{
            height: "2.5rem",
            display: "block",
            width: "10rem",
            cursor: "pointer",
          }}
          href="#"
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {arr &&
            arr.map((item, i) => (
              <div key={i}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      aria-current="page"
                      href="#"
                      onClick={() => navigateTo(item)}
                    >
                      {item.title}
                    </a>
                  </li>
                </ul>
              </div>
            ))}
        </div>
        <div>
          {isUserLoggedIn ? (
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={() => logout()}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={() => navigateTo({ path: "/login", role: "ALL" })}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
export default NavBar;
