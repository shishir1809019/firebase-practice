import logo from "./logo.svg";
import "./App.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import firebaseInitialization from "./Firebase/firebase.init";
import { useState } from "react";
firebaseInitialization();

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  const auth = getAuth();

  const toggleLogin = (e) => {
    setIsLogin(e.target.checked);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 character");
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must contain 2 uppercase");
      return;
    }

    isLogin ? processLogin(email, password) : registerNewUser(email, password);
  };

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setUserName();
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const processLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const { email, displayName } = result.user;
        const userInfo = {
          name: displayName,
          email: email,
        };
        setUser(userInfo);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {
      // Profile updated!
    });
  };

  return (
    <div className="mx-5">
      <h3>Please {isLogin ? "Login" : "Register"}</h3>
      <form className="row g-3" onSubmit={handleRegistration}>
        {!isLogin && (
          <div className="col-12">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              onBlur={handleNameChange}
              type="text"
              className="form-control"
              id="name"
              placeholder="Your Name"
            />
          </div>
        )}
        <div className="col-md-6">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            onBlur={handleEmailChange}
            type="email"
            className="form-control"
            id="inputEmail4"
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            onBlur={handlePasswordChange}
            type="password"
            className="form-control"
            id="inputPassword4"
            required
          />
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              onClick={toggleLogin}
              className="form-check-input"
              type="checkbox"
              id="gridCheck"
            />
            <label className="form-check-label" htmlFor="gridCheck">
              Already registered?
            </label>
          </div>
        </div>
        <div>{error}</div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </form>{" "}
      <br />
      <div>Name: {name}</div>
      <div>Email: {user.email}</div>
    </div>
  );
}

export default App;
