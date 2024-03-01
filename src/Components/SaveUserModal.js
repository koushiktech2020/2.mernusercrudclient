/* eslint-disable */
import React, { useState, useEffect } from "react"; // Importing React hooks

import { getData, postData, putData, uploadSingleFile } from "Utils/HttpClient"; // Importing HTTP client utility functions
import { base_url } from "Helper/UrlHelper/UrlHelper"; // Importing base URL for API requests
import {
  add_new_user,
  get_user_details,
  update_user,
} from "Helper/UrlHelper/UserUrlHelper"; // Importing user-related API endpoint URLs
import { single_upload } from "Helper/UrlHelper/UploadUrlHelper"; // Importing URL for single file upload

const SaveUserModal = ({
  selectedUserId,
  setSelectedUserId,
  afterModalClose,
}) => {
  // State variables
  const [name, setName] = useState(""); // State variable for user name
  const [email, setEmail] = useState(""); // State variable for user email
  const [address, setAddress] = useState(""); // State variable for user address
  const [role, setRole] = useState(""); // State variable for user role
  const [phone, setPhone] = useState(""); // State variable for user phone
  const [photoPublicUrl, setPhotoPublicUrl] = useState(""); // State variable for public URL of user photo
  const [photoPublicId, setPhotoPublicId] = useState(""); // State variable for public ID of user photo

  // Function to handle photo upload
  const photoUploader = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    try {
      let endPoint = `${base_url}${single_upload}`; // API endpoint for single file upload

      const response = await uploadSingleFile(endPoint, file); // Upload file

      if (response.status) {
        setPhotoPublicUrl(response.data.photopublicurl); // Set public URL of photo
        setPhotoPublicId(response.data.photopublicid); // Set public ID of photo
        resetProfileImageFile(); // Reset file input
      }
    } catch (error) {
      console.log(error.message); // Log error message
    }
  };

  // Function to fetch user details
  const getUserDetails = async () => {
    try {
      let endPoint = base_url + get_user_details + `/${selectedUserId}`; // API endpoint for getting user details

      const response = await getData(endPoint); // Fetch user details

      if (response.status) {
        // Set state variables with user details
        setName(response.data.name);
        setEmail(response.data.email);
        setAddress(response.data.role);
        setRole(response.data.address);
        setPhone(response.data.phone);
        setPhotoPublicId(response.data.photopublicid);
        setPhotoPublicUrl(response.data.photopublicurl);
      }
    } catch (error) {
      console.log(error.message); // Log error message
    }
  };

  // Function to save user data
  const saveUserHandler = async (e) => {
    try {
      const userData = {
        name,
        email,
        address,
        role,
        phone,
        photopublicid: photoPublicId,
        photopublicurl: photoPublicUrl,
      };

      let endPoint = `${base_url}`; // Base API endpoint

      let response = {}; // Response object

      if (selectedUserId) {
        // If selected user ID exists, update user data
        endPoint += `${update_user}/${selectedUserId}`; // API endpoint for updating user
        response = await putData(endPoint, userData); // PUT request to update user data
      } else {
        // If selected user ID doesn't exist, add new user
        endPoint += `${add_new_user}`; // API endpoint for adding new user
        response = await postData(endPoint, userData); // POST request to add new user
      }

      resetAll(); // Reset all state variables

      if (response.status) {
        // If request is successful, close modal and refresh user list
        let modal = bootstrap.Modal.getInstance(
          document.querySelector("#saveUserModal")
        );
        modal.hide(); // Hide modal
        afterModalClose(); // Call function to handle modal close
      }
    } catch (error) {
      console.log(error); // Log error message
    }
  };

  // Function to reset file input value
  const resetProfileImageFile = () => {
    const file = document.getElementById("uploadprofileimage"); // Get file input element
    if (file) {
      file.value = null; // Reset file input value
    } else {
      return;
    }
  };

  // Function to reset all state variables
  const resetAll = () => {
    setName(""); // Reset user name
    setEmail(""); // Reset user email
    setAddress(""); // Reset user address
    setPhone(""); // Reset user phone
    setRole(""); // Reset user role
    setPhotoPublicUrl(""); // Reset public URL of user photo
    setPhotoPublicId(""); // Reset public ID of user photo
    setSelectedUserId(null); // Reset selected user ID
  };

  // Fetch user details on component mount if selected user ID exists
  useEffect(() => {
    if (selectedUserId) {
      getUserDetails();
    }
  }, [selectedUserId]);

  return (
    <div
      className="modal fade"
      id="saveUserModal"
      tabIndex="-1"
      aria-labelledby="saveUserModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="saveUserModalLabel">
              Save User
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={resetAll}
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Phone
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="row ">
                <div className="col-lg-10">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Photo
                    </label>
                    <input
                      id="uploadprofileimage"
                      type="file"
                      className="form-control"
                      onChange={photoUploader}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="mb-3">
                    <img
                      src={photoPublicUrl}
                      alt="img"
                      className="rounded img-thumbnail"
                      height={35}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveUserHandler}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveUserModal;
