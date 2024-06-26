import React from "react";
import "./Auth.css";
import { Button, Checkbox, Col, Input, Row } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
} from "@ant-design/icons";
// import {Link} from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import * as links from "../../../utils/links";
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
    <div className="Auth_container">
      <Row className="Auth_rowContainer">
        <Col xs={24} md={12} lg={12} xl={12} className="Auth_colAuthForm">
          <div className="Auth_authBlock">
            <div className="Auth_authTitle">
              <FiLogIn className="Auth_authTitleIcon" />
              <div className="Auth_authTitleText">{authTitle}</div>
            </div>
            <div className="Auth_authDescription">{authDescription}</div>
            <form className="Auth_authForm" onSubmit={onsubmit}>
              {authFields.map((itemField, indexField) => {
                switch (itemField.type) {
                  case "text":
                    return (
                      <div className="Auth_itemField" key={indexField}>
                        <label
                          htmlFor="username"
                          className="Auth_itemFieldLabel"
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
                          <div className="Auth_itemFieldError">
                            {itemField.error}
                          </div>
                        )}
                      </div>
                    );
                  case "password":
                    return (
                      <div className="Auth_itemField" key={indexField}>
                        <label
                          htmlFor="password"
                          className="Auth_itemFieldLabel"
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
                          <div className="Auth_itemFieldError">
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
              className="Auth_authSubmit"
              onClick={() => {
                if (typeof onsubmit === "function") {
                  onsubmit();
                }
              }}
            >
              {authSubmit}
            </Button>
            {successMessage && (
              <div className="Auth_successMessage">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="Auth_errorMessage">
                <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
              </div>
            )}
          </div>
        </Col>
        {
          <Col xs={24} md={12} lg={12} xl={12} className="Auth_colAuthImage">
            {authImage && (
              <img className="Auth_authImage" src={authImage} alt="auth" />
            )}
            {/* {
                        textImage && (
                            <p className="LogoTextImage CenteredText">
                                {textImage}
                            </p>
                        )
                    } */}
            {textImage && (
              <div className="LogoTextImage CenteredText">
                {textImage}
                <div className="MediaIcons">
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faFacebook} className="SocialIcon" />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="SocialIcon InstagramIcon"
                    />
                  </a>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="SocialIcon WhatsIcon"
                    />
                  </a>
                </div>
              </div>
            )}
          </Col>
        }
      </Row>
    </div>
  );
};

export default Auth;
