import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './searchBar.css'

function SearchBar() {
  const [inputText, setInputText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    axios.get('http://127.0.0.1:8000/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
    })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  // Filtered data based on the input text
  const filteredUsers = users.filter((user) =>
   user.username.toLowerCase().includes(inputText)
);

  const shouldShowList = inputText.length > 0;

  //if (loading) return <h1 className="lmsg">Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="search">
      <h1 className="searchTitle">Search for NetWorkers!</h1>
      <div className="searchBar">
        <input
          id="outlined-basic"
          onChange={inputHandler}
          variant="outlined"
          fullWidth
          label="Search"
        />
      </div>
      {shouldShowList && (
        <ul className="searchUsers">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.id}>
                <Link to={`/auth/profile/${user.username}`}>
                  {user.username}
                </Link>
              </li>
            ))
          ) : (
            <p className="noUsers">No users found</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;