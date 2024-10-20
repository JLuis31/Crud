import "../Menu/Menu.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Menu = function () {
  const Navigate = useNavigate();
  const handleCerrar = function () {
    localStorage.removeItem("token");
    Navigate("/login");
  };

  return (
    <div className="menuscont">
      <div className="menu-container">
        <p className="menup2">Menu</p>

        <div className="menu2">
          <ul className="menu">
            <li className="link">
              <Link className="color crud" to="/">
                <button>CRUD</button>
              </Link>{" "}
            </li>
            {localStorage.getItem("token") === null ? (
              <div className="reglog">
                <li className="link link1">
                  <Link className="color" to="/Login">
                    <button>Login</button>
                  </Link>
                </li>
                <li className="link link2">
                  <Link className="color" to="/Register">
                    <button>Register</button>
                  </Link>{" "}
                </li>
              </div>
            ) : (
              ""
            )}

            <li className="link link3">
              <Link onClick={handleCerrar} className="color" to="/Login">
                <button> Logout</button>
              </Link>{" "}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
