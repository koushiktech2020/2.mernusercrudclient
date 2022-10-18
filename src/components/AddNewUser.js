/* eslint-disable */
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HttpClient from "../utils/HttpClient";

const AddNewUser = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const photoUploader = (e) => {
    setPhoto(e.target.files[0]);
  };

  const createUserHandler = async (e) => {
    try {
      const userData = {
        name,
        email,
        address,
        role,
        phone,
        photo,
      };

      const endPoint = "/user";
      const method = "POST";

      const response = await HttpClient.formData(endPoint, method, userData);
      console.log(response);
      if (response.status) {
        props.hideAddNewModal(true);
      } else {
        props.hideAddNewModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetAll = () => {
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setRole("");
    setPhoto("");
  };

  const closeModal = () => {
    resetAll();
    props.hideAddNewModal(false);
  };

  return (
    <Modal show={props.showAddNewModal} onHide={closeModal}>
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
              value={name}
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
              value={email}
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
              value={address}
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
              value={role}
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
              value={phone}
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
        <Button variant="primary" onClick={createUserHandler}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewUser;
