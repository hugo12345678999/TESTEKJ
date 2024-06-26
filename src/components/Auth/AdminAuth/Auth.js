import React from "react";
import "./Auth.css";
import { Button, Checkbox, Col, Input, Row } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
} from "@ant-design/icons";
import { FiLogIn } from "react-icons/fi";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
const Auth = (props) => {
  const {
    authTitle,
    authDescription,
    authFields,
    authSubmit,
    authImage,
    onsubmit,
    successMessage,
    errorMessage,
    textImage,
  } = props;
  return (
    <div className="Admin_Auth_container">
      <Row className="Admin_Auth_rowContainer">
        <Col xs={24} md={10} lg={10} xl={10} className="Admin_Auth_AuthForm">
          {textImage && <div className="Admin_LogoTextImage">{textImage}</div>}
          <div className="Admin_Auth_authBlock">
            <div className="Admin_Auth_authTitle">
              <FiLogIn className="Admin_Auth_authTitleIcon" />
              <div className="Admin_Auth_authTitleText">{authTitle}</div>
            </div>

            <form className="Admin_Auth_AuthForm" onSubmit={onsubmit}>
              {authFields.map((itemField, indexField) => {
                switch (itemField.type) {
                  case "text":
                    return (
                      <div className="Admin_Auth_itemField" key={indexField}>
                        <label
                          htmlFor="username"
                          className="Admin_Auth_itemFieldLabel"
                        >
                          {itemField.label}
                        </label>
                        <Input
                          placeholder={itemField.placeholder ?? ""}
                          value={itemField.value}
                          id="username"
                          type="text"
                          name="username"
                          autoComplete="username"
                          onChange={(event) => {
                            if (typeof itemField.setField === "function") {
                              itemField.setField(event.target.value);
                            }
                          }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              onsubmit();
                            }
                          }}
                        />
                        {itemField.error && (
                          <div className="Admin_Auth_itemFieldError">
                            {itemField.error}
                          </div>
                        )}
                      </div>
                    );
                  case "password":
                    return (
                      <div className="Admin_Auth_itemField" key={indexField}>
                        <label
                          htmlFor="password"
                          className="Admin_Auth_itemFieldLabel"
                        >
                          {itemField.label}
                        </label>
                        <Input.Password
                          placeholder={itemField.placeholder ?? ""}
                          id="password"
                          value={itemField.value}
                          type="password"
                          name="password"
                          autoComplete="current-password"
                          iconRender={(visible) =>
                            visible ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                              ></FontAwesomeIcon>
                            ) : (
                              <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            )
                          }
                          onChange={(event) => {
                            if (typeof itemField.setField === "function") {
                              itemField.setField(event.target.value);
                            }
                          }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              onsubmit();
                            }
                          }}
                        />
                        {itemField.error && (
                          <div className="Admin_Auth_itemFieldError">
                            {itemField.error}
                          </div>
                        )}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </form>
            <Button
              className="Admin_Auth_authSubmit"
              onClick={() => {
                if (typeof onsubmit === "function") {
                  onsubmit();
                }
              }}
            >
              {authSubmit}
            </Button>
            {successMessage && (
              <div className="Admin_Auth_successMessage">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="Admin_Auth_errorMessage">
                <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
              </div>
            )}
          </div>
          <div className="Admin_MediaIcons">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="Admin_Auth_SocialIcon"
              />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="Admin_Auth_SocialIcon"
              />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="Admin_Auth_SocialIcon"
              />
            </a>
          </div>
        </Col>

        <Col xs={24} md={14} lg={14} xl={14} className="Admin_Auth_AuthImage">
          {authImage && (
            <img className="Admin_Auth_AuthImage" src={authImage} alt="auth" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Auth;
