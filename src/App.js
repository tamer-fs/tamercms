import TitleBar from "./components/TitleBar";
import $ from "jquery";
import "./App.css";
import { useState } from "react";
import db from "./firebaseConfig";
import { onValue, ref, set } from "firebase/database";

function App() {
  const [buisnessName, setBuisnessName] = useState("");
  const [password, setPassword] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [usedBuisnessName, setUsedBuisnessName] = useState("");

  const handleLoginSubmit = (e) => {
    let buisnessData;
    e.preventDefault();
    const buisnessRef = ref(db, `${buisnessName}/`);
    onValue(buisnessRef, (snapshot) => {
      buisnessData = snapshot.val();
    });
    if (buisnessData != null) {
      // buisness exists
      setUsedBuisnessName(buisnessName);
      const passwordRef = ref(db, `${buisnessName}/Password`);
      onValue(passwordRef, (snapshot) => {
        console.log(snapshot.val(), password);
        if (snapshot.val() == password) {
          // correct password
          loadData();
        } else {
          alert("verkeerd wachtwoord / bedrijfsnaam");
        }
      });
    } else {
      alert("verkeerd wachtwoord / bedrijfsnaam");
    }
  };

  const loadData = () => {
    const inputsRef = ref(db, `${buisnessName}/Inputs`);
    onValue(inputsRef, (snapshot) => {
      setInputFields(snapshot.val());
      console.log(snapshot.val());
    });
    setLoggedIn(true);
    console.log(inputFields);
  };

  const handleDataChange = (id, data, value) => {
    set(ref(db, `${usedBuisnessName}/Inputs/${id}`), {
      for: data.for,
      content: value,
    });
    loadData();
  };

  return (
    <>
      <TitleBar />
      <div className="form-container">
        <form
          className="main-form"
          action="http://localhost:8000/server.php"
          method="post"
          onSubmit={(e) => handleLoginSubmit(e)}
        >
          <div className="mb-3">
            <label htmlFor="buisnessInput" className="form-label">
              Bedrijf naam
            </label>
            <input
              type="text"
              className="form-control"
              id="buisnessInput"
              value={buisnessName}
              name="buisnessName"
              onChange={(e) => setBuisnessName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log in
          </button>
        </form>
        <div className="cms-container">
          {inputFields.map((data, index) => (
            <div className="input-container">
              <label htmlFor={data.for}>{data.for}</label>
              <textarea
                id={data.for}
                className="form-control"
                placeholder={data.content}
              />
              <button
                className="btn btn-outline-primary"
                onClick={(e) =>
                  handleDataChange(
                    index,
                    data,
                    document.getElementById(data.for).value
                  )
                }
              >
                Invoeren
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
