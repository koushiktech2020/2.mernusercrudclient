/* eslint-disable */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HttpClient from "../utils/HttpClient";

const EditUser = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const photoUploader = (e) => {
    setPhoto(e.target.files[0]);
  };

  const editUserHandler = async (e) => {
    try {
      const userData = {
        name,
        email,
        address,
        role,
        phone,
        photo,
      };

      const endPoint = `/user/${props.editModalData._id}`;
      const method = "PUT";

      const response = await HttpClient.formData(endPoint, method, userData);
      console.log(response);
      if (response.status) {
        props.hideEditModal(true);
      } else {
        props.hideEditModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    props.hideEditModal(false);
  };

  useEffect(() => {
    if (props.editModalData) {
      setName(props.editModalData.name);
      setEmail(props.editModalData.email);
      setAddress(props.editModalData.address);
      setRole(props.editModalData.role);
      setPhone(props.editModalData.phone);
    }
  }, [props.editModalData]);

  return (
    <Modal show={props.showEditModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="name"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="user@example.com"
              value={email ? email : ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              value={address ? address : ""}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              value={role ? role : ""}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Phone
            </label>
            <input
              type="email"
              className="form-control"
              value={phone ? phone : ""}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Photo
            </label>
            <input
              type="file"
              className="form-control"
              onChange={photoUploader}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={editUserHandler}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
