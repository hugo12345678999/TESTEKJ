import React, { useContext, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./DeleteCliente.css";
import { Button } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import question_icon from "../../../../assets/images/question.png";
import axios from "axios";

const DeleteCliente = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const deleteHandler = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_SERVIDOR}/cliente/${id}`,
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      // data: { id },
    };

    axios
      .request(config)
      .then((res) => {
        setNotiMessage({
          type: "success",
          message: "Deleted Successfully.",
        });
        navigate(links.DASHBOARD_CLIENTES);
      })
      .catch((err) => {
        setNotiMessage({
          type: "error",
          message: err?.response.data,
        });
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message: "Delete Failed",
          });
          setDataUser(null);
        }
      });
  };

  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="Delete_Cliente_Content">
        <img
          className="Delete_Cliente_Icon"
          src={question_icon}
          alt="question icon"
        />
        <p className="Delete_Cliente_Text"> Deseja excluir cliente?</p>
        <div className="Delete_Cliente_Btns">
          <Button
            className="Delete_Cliente_Cancel_Btn"
            onClick={() => {
              navigate(`${links.EDITAR_CLIENTES}/${id}`, {
                state: location.state,
              });
            }}
          >
            <span>NÃO</span>
          </Button>{" "}
          <Button
            className="Delete_Cliente_Delete_Btn"
            onClick={() => {
              deleteHandler();
            }}
          >
            <span>SIM, EXCLUA</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCliente;
