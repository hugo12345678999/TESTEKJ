import React from "react";
import "./ConfigAuth.css";
import { Button, Col, Input, Row } from "antd";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import * as links from "../../../../utils/links";

const ConfigAuth = (props) => {
  let navigate = useNavigate();

  const {
    authFields,
    authSubmit,
    authImage,
    onsubmit,
    success,
    successMessage,
    errorMessage,
    textImage,
  } = props;
  return (
    <div className="Config_Auth_container">
      <Row className="Admin_Auth_rowContainer">
        <Col xs={24} md={10} lg={10} xl={10} className="Config_Auth_AuthForm">
          {textImage && <div className="Admin_LogoTextImage">{textImage}</div>}
          <div className="Config_Auth_authBlock">
            {!success && (
              <form className="Config_Auth_AuthForm" onSubmit={onsubmit}>
                {authFields.map((itemField, indexField) => {
                  switch (itemField.type) {
                    case "text":
                      return (
                        <div className="Config_Auth_itemField" key={indexField}>
                          <label
                            htmlFor="username"
                            className="Config_Auth_itemFieldLabel"
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
                            <div className="Config_Auth_itemFieldError">
                              {itemField.error}
                            </div>
                          )}
                        </div>
                      );
                    case "password":
                      return (
                        <div className="Config_Auth_itemField" key={indexField}>
                          <label
                            htmlFor="password"
                            className="Config_Auth_itemFieldLabel"
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
                            <div className="Config_Auth_itemFieldError">
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
            )}
            {!success && (
              <Button
                className="Config_Auth_authSubmit"
                onClick={() => {
                  if (typeof onsubmit === "function") {
                    onsubmit();
                  }
                }}
              >
                {authSubmit}
              </Button>
            )}
            {errorMessage && (
              <div className="Config_Auth_errorMessage">
                <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
              </div>
            )}
            {success && (
              <Button
                className="Config_Auth_authSubmit"
                onClick={() => navigate(links.ADMIN_SIGNIN)}
              >
                Acessar Painel ADM V4
              </Button>
            )}
          </div>
        </Col>

        <Col xs={24} md={14} lg={14} xl={14} className="Config_Auth_AuthImage">
          {authImage && (
            <img className="Config_Auth_AuthImage" src={authImage} alt="auth" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ConfigAuth;
