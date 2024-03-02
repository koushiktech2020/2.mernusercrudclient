/* eslint-disable */
import { useState, useEffect } from "react"; // Importing React hooks
import { getData, deleteData } from "Utils/HttpClient"; // Importing HTTP client utility functions
import SaveUserModal from "Components/SaveUserModal"; // Importing component for saving user modal

import { base_url } from "Helper/UrlHelper/UrlHelper"; // Importing base URL for API requests
import { get_all_user, delete_user } from "Helper/UrlHelper/UserUrlHelper"; // Importing user-related API endpoint URLs

const Home = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]); // State variable for user list
  const [selectedUserId, setSelectedUserId] = useState(null); // State variable for selected user ID

  // Function to fetch user list from server
  const getUserList = async () => {
    try {
      setIsLoading(true);
      const endPoint = base_url + get_all_user; // API endpoint for getting all users
      const response = await getData(endPoint); // Making HTTP GET request
      setIsLoading(false);
      if (response.status) {
        setUserList(response.data); // Setting user list state variable with response data
      }
    } catch (error) {
      console.log(error.message); // Logging error message
    }
  };

  // Function to delete a user
  const deleteUserHandler = async (userId) => {
    try {
      const endPoint = `${base_url}${delete_user}/${userId}`; // API endpoint for deleting a user
      const response = await deleteData(endPoint); // Making HTTP DELETE request

      if (response.status) {
        getUserList(); // Refreshing user list after deletion
      }
    } catch (error) {
      console.log(error); // Logging error message
    }
  };

  // Fetch user list on component mount
  useEffect(() => {
    getUserList();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <div className="container text-center">
          <h1>User Management System</h1>
        </div>

        <div className="mb-2 gap-2 d-flex justify-content-center align-items-center mt-5">
          <h1 className="text-primary">Please wait while fetching data</h1>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
            return (
              <div
                key={index}
                className="text-primary spinner-grow spinner-grow-sm"
                role="status"
                style={{ width: "0.7rem", height: "0.7rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="container text-center">
          <h1>User Management System</h1>
        </div>

        <div className="mb-2 d-flex justify-content-end mt-5">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#saveUserModal"
          >
            Add New
          </button>
        </div>

        <div className="mt-5">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Address</th>
                <th>Phone</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Iterate over user list */}
              {userList.map((user, index) => {
                return (
                  <tr key={index}>
                    <td className="d-flex justify-content-center">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <p className="mb-0">{user.name}</p>
                        <img
                          src={user.photopublicurl}
                          alt="img"
                          height={25}
                          width={25}
                          className="rounded-circle cover-fill"
                        />
                      </div>
                    </td>

                    <td className="text-center">{user.email}</td>
                    <td className="text-center">{user.role}</td>
                    <td className="text-center">{user.address}</td>
                    <td className="text-center">{user.phone}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#saveUserModal"
                        onClick={() => {
                          setSelectedUserId(user._id);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger w-75"
                        onClick={() => {
                          deleteUserHandler(user._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal for adding/updating users */}
        <SaveUserModal
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          afterModalClose={getUserList}
        />
      </div>
    );
  }
};

export default Home;
