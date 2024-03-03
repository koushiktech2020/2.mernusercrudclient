/* eslint-disable */
import React, { useState, useEffect } from "react"; // Importing React hooks

import { getData, postData, putData, uploadSingleFile } from "Utils/HttpClient"; // Importing HTTP client utility gatweway functions
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // State variable for public URL of user photo
  const [uploadedImageId, setUploadedImageId] = useState(null); // State variable for public ID of user photo

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Function to handle input field changes
  const onInputChangeHandler = (e) => {
    const { name, value } = e.target;

    // Switch case to determine which input field triggered the change
    switch (name) {
      case "name":
        setName(value); // Update name state
        setNameError(""); // Clear name error
        break;
      case "email":
        setEmail(value); // Update email state
        setEmailError(""); // Clear email error
        break;
      case "address":
        setAddress(value); // Update address state
        setAddressError(""); // Clear address error
        break;
      case "role":
        setRole(value); // Update role state
        setRoleError(""); // Clear role error
        break;
      case "phone":
        setPhone(value); // Update phone state
        setPhoneError(""); // Clear phone error
        break;
      default:
        break;
    }
  };

  // Function to validate input fields
  const validateInputs = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError("* Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("* Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate address
    if (!address.trim()) {
      setAddressError("* Address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    // Validate role
    if (!role.trim()) {
      setRoleError("* Role is required");
      isValid = false;
    } else {
      setRoleError("");
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError("* Phone is required");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Validate uploaded image
    if (!uploadedImageId) {
      setUploadError("* Image is required");
      isValid = false;
    } else {
      setUploadError("");
    }

    return isValid;
  };

  // Function to handle photo upload
  const photoUploader = async (e) => {
    setUploadError("");
    const file = e.target.files[0]; // Get the selected file
    try {
      let endPoint = `${base_url}${single_upload}`; // API endpoint for single file upload

      const response = await uploadSingleFile(endPoint, file); // Upload file

      if (response.status) {
        setUploadedImageUrl(response.data.publicurl); // Set public URL of photo
        setUploadedImageId(response.data._id); // Set public ID of photo
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
        setUploadedImageId(response.data.uploadedimage?._id ?? null);
        setUploadedImageUrl(response.data.uploadedimage?.publicurl ?? "");
      }
    } catch (error) {
      console.log(error.message); // Log error message
    }
  };

  // Function to save user data
  const saveUserHandler = async (e) => {
    if (validateInputs()) {
      setIsSaving(true);
      try {
        const userData = {
          name,
          email,
          address,
          role,
          phone,
          uploadedimage: uploadedImageId || null,
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

        setIsSaving(false);
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
    setUploadedImageUrl(""); // Reset public URL of user photo
    setUploadedImageId(null); // Reset public ID of user photo
    setSelectedUserId(null); // Reset selected user ID
    setNameError("");
    setEmailError("");
    setAddressError("");
    setRoleError("");
    setPhoneError("");
    setUploadError("");
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
                  name="name"
                  value={name}
                  onChange={onInputChangeHandler}
                />
                <div className="text-danger">{nameError}</div>
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
                  name="email"
                  value={email}
                  onChange={onInputChangeHandler}
                />
                <div className="text-danger">{emailError}</div>
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
                  name="address"
                  value={address}
                  onChange={onInputChangeHandler}
                />
                <div className="text-danger">{addressError}</div>
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
                  name="role"
                  value={role}
                  onChange={onInputChangeHandler}
                />
                <div className="text-danger">{roleError}</div>
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
                  name="phone"
                  value={phone}
                  onChange={onInputChangeHandler}
                />
                <div className="text-danger">{phoneError}</div>
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
                      src={uploadedImageUrl}
                      alt="img"
                      className="rounded img-thumbnail"
                      height={35}
                    />
                  </div>
                </div>
                <div className="text-danger">{uploadError}</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={resetAll}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveUserHandler}
            >
              Save
              {isSaving && (
                <div
                  className="ms-2 spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveUserModal;
