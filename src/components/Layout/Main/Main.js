import React, { useContext, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Main.css";
import * as links from "../../../utils/links";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faXmark,
  faBars,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Main = (props) => {
  const { children } = props;
  const { setDataUser, loading, authInfo } = useContext(AuthContext);

  const location = useLocation();
  let navigate = useNavigate();

  const { dataUser } = authInfo;

  const [isOpen, setIsOpen] = useState(false);

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => {
                setDataUser(null);
              }}
            >
              Sair
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <>
      <div className="Main_container">
        <div className={`Main_sidebar ${isOpen ? "open" : ""}`}>
          <button
            type="button"
            className="sidebar-burger"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FontAwesomeIcon icon={faXmark} className="icon fa-2x" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="icon fa-2x" />
            )}
          </button>
          <div className={`Main_menuProfile ${isOpen ? "open" : ""}`}>
            <div className="circle-icon">
              <span>PIX GRUA</span>
            </div>
          </div>

          <Link
            to={
              dataUser?.key === "CLIENT"
                ? links.DASHBOARD_FORNECEDOR
                : links.DASHBOARD_CLIENTES
            }
            className={`Main_menuitemLink ${isOpen ? "open" : ""}`}
          >
            <div className="Main_menuitem">
              <FontAwesomeIcon icon={faServer} className="icon" />
              <div className={`SidebarMaquina ${isOpen ? "open" : ""}`}>
                {dataUser?.key === "CLIENT" ? `Maquinas` : `Clientes`}
              </div>
            </div>
          </Link>
          <div className={`Main_header ${isOpen ? "open" : ""}`}>
            {/* <div className="Main_headerBetween"></div> */}
            <div
              className="Main_headerRight"
              onClick={() => {
                navigate(
                  dataUser?.key === "CLIENT" ? links.SIGNIN : links.ADMIN_SIGNIN
                );
                setDataUser(null);
              }}
            >
              {/* <Dropdown overlay={menu} placement="bottomRight" arrow> */}
              <div className="Main_headerSearch">
                <span style={{ fontSize: "12px" }}>{dataUser.name}</span>
                <FontAwesomeIcon
                  className="icon"
                  style={{ marginLeft: "5px" }}
                  icon={faRightFromBracket}
                ></FontAwesomeIcon>
              </div>
              {/* </Dropdown> */}
            </div>
          </div>
        </div>
        <div className="Main_right">
          <div
            className="Main_content"
            style={{ marginTop: "30px", marginLeft: "-10px" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
