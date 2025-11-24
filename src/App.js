import React, { useEffect, useState } from "react";
import UserForm from "./Components/UserForm";
import "./App.css";
import UserDetails from "./Components/UserDetails";
import axios from "axios";
import Loader from "./Components/Loader";

function App() {
  let [showForm, setShowForm] = useState(false);
  let [users, setUsers] = useState([]);
  let [userToEdit, setUser] = useState(null);
  let [loading, setLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState(null);
  let [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  function addUserHandler() {
    setEditMode(false);
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
    if (!editMode) {
      axios
        .post(
          "https://reacthttpcrud-default-rtdb.firebaseio.com/users.json",
          user
        )
        .then((res) => {
          //console.log(res.data);
          fetchUsers();
        });
    } else {
      axios
        .put(
          `https://reacthttpcrud-default-rtdb.firebaseio.com/users/${userToEdit.id}.json`,
          user
        )
        .then((res) => {
          //console.log(res.data);
          fetchUsers();
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }

    setShowForm(false);
  }

  function fetchUsers() {
    setLoading(true);
    setErrorMessage(null);

    //fetch by default execute get method
    // fetch("https://reacthttpcrud-default-rtdb.firebaseio.com/users.json")
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error("Something went wrong");
    //      //fetch method wont directly send error message so we have to follow this way
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     let userData = [];
    //     for (let key in data) {
    //       userData.push({ ...data[key], id: key });
    //     }
    //     //console.log(userData);
    //     setUsers(userData);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     setErrorMessage(error.message);
    //     setLoading(false);
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
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoading(false);
      });
  }

  function onEditUser(user) {
    setEditMode(true);
    setShowForm(true);
    setUser(user);
  }

  function onDeleteUser(user) {
    let del = window.confirm(
      `Do you really want ro delete the record of ${user.firstName} ${user.lastName}`
    );
    if (del) {
      axios
        .delete(
          `https://reacthttpcrud-default-rtdb.firebaseio.com/users/${user.id}.json`,
          user
        )
        .then((res) => {
          //console.log(res.data);
          fetchUsers();
          setShowForm(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
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
      {!loading && !errorMessage && (
        <UserDetails
          users={users}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
        ></UserDetails>
      )}
      {errorMessage && <h3 style={{ textAlign: "center" }}>{errorMessage}</h3>}
      {loading && <Loader />}
      {showForm && (
        <UserForm
          editMode={editMode}
          closeForm={closeForm}
          createUser={onCreateUser}
          user={userToEdit}
        ></UserForm>
      )}
    </div>
  );
}

export default App;
