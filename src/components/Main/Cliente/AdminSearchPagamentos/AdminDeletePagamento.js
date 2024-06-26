import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminDeletePagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import question_icon from "../../../../assets/images/question.png";
import axios from "axios";

const AdminDeletePagamento = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { maquinaInfos, clienteInfo } = location.state;

  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const deleteHandler = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_SERVIDOR}/maquina`,
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      data: { id },
    };

    axios
      .request(config)
      .then((res) => {
        setNotiMessage({
          type: "success",
          message: "Deleted Successfully.",
        });
        navigate(`${links.CLIENTES_MAQUINAS}/${clienteInfo.id}`, {
          state: location.state.clienteInfo,
        });
      })
      .catch((err) => {
        if ([401, 403].includes(err.response.status)) {
          // setNotiMessage('A sua sessão expirou, para continuar faça login novamente.');
          setNotiMessage({
            type: "error",
            message: "Delete Failed",
          });
          setDataUser(null);
        }
      });
  };

  return (
    <div className="Admin_PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="Admin_Update_Pagamento_Content">
        <img
          className="Admin_Update_Pagamento_Icon"
          src={question_icon}
          alt="question icon"
        />
        <p className="Admin_Update_Pagamento_Text">
          Deseja excluir essa máquina?
        </p>
        <div className="Admin_Update_Pagamento_Btns">
          <Button
            className="Admin_Update_Pagamento_Cancel_Btn"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINAS_EDIT_FORNECEDOR}/${id}`, {
                state: location.state,
              });
            }}
          >
            <span>NÃO</span>
          </Button>{" "}
          <Button
            className="Admin_Update_Pagamento_Delete_Btn"
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

export default AdminDeletePagamento;
