import React from "react";
import "../../App.css";
import "./TextInput.css";

import {ref, set, onValue} from "firebase/database";
import db from "../../firebaseConfig";

function TextInput({data, index, usedBuisnessName}) {

    const handleDataChange = (id, data, value) => {
        set(ref(db, `${usedBuisnessName}/Inputs/${id}`), {
          for: data.for,
          content: value,
        });
        const element = document.getElementById(data.for);
    };

    return (
        <div className="input-container" key={index}>
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
                    document.getElementById(data.for).value,
                  )
                }
            >
                Invoeren
            </button>
        </div>
    );
}

export default TextInput;