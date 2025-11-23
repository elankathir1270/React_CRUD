import React, { useState } from "react";
import UserForm from "./Components/UserForm";
import "./App.css";
import UserDetails from "./Components/UserDetails";
import axios from "axios";

function App() {
  let [showForm, setShowForm] = useState(false);
  let [users, setUsers] = useState([]);

  function addUserHandler() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  function onCreateUser(user) {
    //browser's api
    // fetch("https://reacthttpcrud-default-rtdb.firebaseio.com/users.json", {
    //   method: "POST",
    //   body: JSON.stringify(user),
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    // }).then((res) => {
    //   console.log(res);
    // });

    //third party api
    axios
      .post(
        "https://reacthttpcrud-default-rtdb.firebaseio.com/users.json",
        user
      )
      .then((res) => {
        console.log(res.data);
      });
  }

  function fetchUsers() {
    //fetch by default execute get method
    // fetch("https://reacthttpcrud-default-rtdb.firebaseio.com/users.json")
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data) => {
    //     let userData = [];
    //     for (let key in data) {
    //       userData.push({ ...data[key], id: key });
    //     }
    //     //console.log(userData);
    //     setUsers(userData);
    //   });

    axios
      .get("https://reacthttpcrud-default-rtdb.firebaseio.com/users.json")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        let userData = [];
        for (let key in data) {
          userData.push({ ...data[key], id: key });
        }
        //console.log(userData);
        setUsers(userData);
      });
  }

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-success" onClick={addUserHandler}>
          Add User
        </button>
        <button className="btn btn-normal" onClick={fetchUsers}>
          Get Users
        </button>
      </div>
      <UserDetails users={users}></UserDetails>
      {showForm && (
        <UserForm closeForm={closeForm} createUser={onCreateUser}></UserForm>
      )}
    </div>
  );
}

export default App;
