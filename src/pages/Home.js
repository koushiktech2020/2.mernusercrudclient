/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddNewUser from "../components/AddNewUser";
import EditUser from "../components/EditUser";
import HttpClient from "../utils/HttpClient";

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  // fucntion for get all user details
  const getUserData = async () => {
    try {
      setIsLoading(true);

      const endPoint = "/user";

      const response = await HttpClient.getData(endPoint);

      if (response.status) {
        setUserData(response.data);
      } else {
        setUserData([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const hideAddNewModal = (data) => {
    setShowAddNewModal(false);
    if (data) {
      getUserData();
    }
  };

  const hideEditModal = (data) => {
    setShowEditModal(false);
    setEditModalData({});
    if (data) {
      getUserData();
    }
  };

  const deleteUser = async (id) => {
    try {
      const endPoint = `/user/${id}`;
      let response = await HttpClient.deleteData(endPoint);
      console.log(response);
      if (response.status) {
        getUserData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // use effect for call function
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col"></div>
          <div className="col-lg-6" style={{ marginTop: "50px" }}>
            <div className="container text-center">
              <h1>User Management System</h1>
            </div>

            <div className="mb-2 d-flex justify-content-end mt-5">
              <Link
                to="UserForm"
                className="btn btn-primary"
                onClick={() => setShowAddNewModal(true)}
              >
                Add New
              </Link>
            </div>

            {isLoading ? (
              <h3 className="text-center">Loading.....</h3>
            ) : (
              <div style={{ marginTop: "5px" }}>
                {userData.length == 0 ? (
                  <h3 className="text-center">No user data found</h3>
                ) : (
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>DOB</th>
                        <th colSpan={2}>Action</th>
                      </tr>
                    </thead>
                    {userData.map((user) => (
                      <tbody key={user._id}>
                        <tr>
                          <td>
                            <img
                              src={user.photo.url}
                              alt="pictures"
                              className="img-thumbnail rounded"
                            />
                          </td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.address}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setEditModalData(user);
                                setShowEditModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                )}
              </div>
            )}
          </div>
          <div className="col"></div>
        </div>
      </div>
      <AddNewUser
        showAddNewModal={showAddNewModal}
        hideAddNewModal={hideAddNewModal}
      />
      <EditUser
        editModalData={editModalData}
        showEditModal={showEditModal}
        hideEditModal={hideEditModal}
      />
    </>
  );
};

export default Home;
