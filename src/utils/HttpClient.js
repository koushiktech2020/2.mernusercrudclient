/* eslint-disable */
const BASE_URL = "https://mernbasiccrudserver.up.railway.app/api/";

const getData = async (endpoint, params) => {
  return request(endpoint, params, "GET");
};

const postData = async (endpoint, params) => {
  return request(endpoint, params, "POST");
};

const putData = async (endpoint, params) => {
  return request(endpoint, params, "PUT");
};

const deleteData = async (endpoint, params) => {
  return request(endpoint, params, "DELETE");
};

const formData = async (url, method, object_get = {}) => {
  const config = {
    method: method,
  };
  let apiUrl = BASE_URL + url;

  const data = new FormData();

  let objArray = Object.keys(object_get);

  objArray.forEach((element) => {
    data.append(element, object_get[element]);
  });

  if (method != "GET") {
    config["body"] = data;
  }

  return fetch(apiUrl, config)
    .then((response) => response.json())
    .catch((err) => {
      throw err;
    });
};
const request = async (endpoint, params = null, method) => {
  try {
    let url = BASE_URL + endpoint;

    const config = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (method == "POST" || method == "PUT") {
      config["body"] = JSON.stringify(params);
    }

    let result = await fetch(url, config);

    if (result.ok === false) {
      let errorData = { status: false, message: "Check base url or endpoint" };
      return errorData;
    } else {
      return await result.json();
    }

    // return fetch(url, config).then((response) => response.json());
  } catch (error) {
    return error;
  }
};

export default {
  getData,
  postData,
  putData,
  deleteData,
  formData,
};
