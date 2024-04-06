import TitleBar from "./components/TitleBar/TitleBar";
import $ from "jquery";
import "./App.css";
import { useState } from "react";
import db from "./firebaseConfig";
import { onValue, ref, set } from "firebase/database";
import TextInput from "./components/TextInputs/TextInput";

function App() {
  const [buisnessName, setBuisnessName] = useState("");
  const [password, setPassword] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [usedBuisnessName, setUsedBuisnessName] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const buisnessRef = ref(db, `${buisnessName}/`);
    onValue(buisnessRef, (snapshot) => {
      if (snapshot.val() != null) {
        // buisness exists
        setUsedBuisnessName(buisnessName);
        const passwordRef = ref(db, `${buisnessName}/Password`);
        onValue(passwordRef, (snapshot) => {
          console.log(snapshot.val(), password);
          if (snapshot.val() == password) {
            // correct password
            loadData();
          } else {
            setShowAlert(true);
          }
        });
      } else {
        setShowAlert(true);
      }
    });
    
  };

  const loadData = () => {
    const inputsRef = ref(db, `${buisnessName}/Inputs`);
    onValue(inputsRef, (snapshot) => {
      setInputFields(snapshot.val());
    });
    setLoggedIn(true);
    setShowAlert(false);
  };

  const changePasswordType = () => {
    const element = document.getElementById("password-input");
    const btn = document.getElementById("show-btn");
    if (element.type == "text") {
      element.type = "password";
      btn.innerText = "show";
    } else {
      element.type = "text";
      btn.innerText = "hide";
    }
  }

  return (
    <>
      <TitleBar />
      
      <div className="form-container">
      {!loggedIn && 
      <>
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
              Wachtwoord
            </label>
            <div className="input-group has-validation">
              
              <input onChange={(e) => setPassword(e.target.value)} id="password-input" type="password" className="form-control"  required />
              <button onClick={() => changePasswordType()} type="button" className="input-group-text" id="show-btn">show</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{marginBottom: 15}}>
            Log in
          </button>
          {
            showAlert && 
            <div className="alert alert-danger" role="alert">
              Verkeerde wachtwoord / bedrijfsnaam ingevuld. 
              Tip: Let op de hoofdletters.
            </div>
          }
        </form>
        
        
      </>
      }
        <div className="cms-container">
          {inputFields.map((data, index) => (
            <TextInput data={data} index={index} usedBuisnessName={usedBuisnessName}/>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
