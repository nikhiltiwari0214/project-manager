import { useState } from "react";
import Login from "./pages/Login";
import Kanban from "./pages/Kanban";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = () => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <Kanban />
          <button
            onClick={handleLogout}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;