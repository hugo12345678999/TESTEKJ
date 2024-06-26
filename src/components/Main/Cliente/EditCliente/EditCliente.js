import React, { useContext, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./EditCliente.css";
import { Button, Input, DatePicker, Tooltip } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import axios from "axios";
import question_icon from "../../../../assets/images/question.png";
import moment from "moment";

const EditCliente = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const cliente = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const dateFormat = "YYYY-MM-DD";
  let currentDate = moment();

  const [data, setData] = useState({
    nome: cliente?.nome ?? "",
    mercadoPagoToken: cliente?.mercadoPagoToken ?? "",
    dataVencimento: cliente?.dataVencimento
      ? moment(cliente?.dataVencimento)
      : currentDate.add(1, "years"),
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      let errorsTemp = { ...prev };
      delete errorsTemp[name];
      return errorsTemp;
    });
  };

  const onSave = () => {
    // check require
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    let body = {
      nome: data.nome,
      dataVencimento: new Date(data.dataVencimento),
    };

    if (
      data.mercadoPagoToken &&
      data.mercadoPagoToken.toString() !== cliente.mercadoPagoToken.toString()
    )
      body.mercadoPagoToken = data.mercadoPagoToken;

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/alterar-cliente-adm-new/${cliente.id}`,
        body,
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate(`${links.DASHBOARD_CLIENTES}`, {
          state: location.state,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
        } else if (err.response.status === 400) {
          setNotiMessage({
            type: "error",
            message: "Já existe uma máquina com esse nome",
          });
          setErrors((prev) => ({
            ...prev,
            nome: "Já existe uma máquina com esse nome",
          }));
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu",
          });
        }
      });
  };

  const onNewPassword = () => {
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/cliente-trocar-senha`,
        { email: cliente?.email },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setNewPassword(res?.data?.newPassword);
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: err.response?.data?.error,
        });
      });
  };

  return (
    <div className="Edit_Cliente_container">
      {isLoading && <LoadingAction />}
      <div className="Edit_Cliente_header">
        <div className="Edit_Cliente_header_left">
          <div className="Edit_Cliente_staBlockTitle">Editar Cliente</div>
        </div>

        <Button
          className="Edit_Cliente_header_back"
          onClick={() => {
            navigate(`${links.CLIENTES_MAQUINAS}/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Edit_Cliente_content">
        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="nome">
            Email: {cliente?.email}
          </label>
        </div>

        <div className="Edit_Cliente_itemField">
          <label className="Edit_Cliente_itemFieldLabel" htmlFor="nome">
            Nome:
          </label>
          <Input
            placeholder={"nome"}
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={`${!!errors.nome ? "Edit_Cliente_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Edit_Cliente_itemFieldError">{errors.nome}</div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          {/* <label
            className="Edit_Cliente_itemFieldLabel"
            htmlFor="mercadoPagoToken"
          >
            Token:
          </label> */}

          <div className="Edit_Cliente_Label_Icon">
            <label
              className="Edit_Cliente_itemFieldLabel"
              htmlFor="mercadoPagoToken"
            >
              Token
            </label>
            
          </div>

          <Input
            placeholder={"APPMP123123-12312-123123"}
            value={data.mercadoPagoToken}
            id="mercadoPagoToken"
            type="text"
            name="mercadoPagoToken"
            autoComplete="mercadoPagoToken"
            onChange={(event) => {
              handleChange("mercadoPagoToken", event.target.value);
            }}
            className={`${
              !!errors.mercadoPagoToken ? "Edit_Cliente_inputError" : ""
            }`}
          />
          {errors.mercadoPagoToken && (
            <div className="Edit_Cliente_itemFieldError">
              {errors.mercadoPagoToken}
            </div>
          )}
        </div>

        <div className="Edit_Cliente_itemField">
          <div className="AddCliente_Label_Icon">
            <label
              className="Edit_Cliente_itemFieldLabel"
              htmlFor="mercadoPagoToken"
            >
              Data de Vencimento
            </label>
            <Tooltip title="A data de vencimento do cliente é uma data que após 10 dias é feito a trava das máquinas do cliente para receber pagamentos. Ideal para quem cobra mensalidade, se não definida por padrão colocamos 1 (um) ano. se não quiser usar coloque uma data maior">
              <img
                src={question_icon}
                alt="question icon"
                className="AddCliente_Icon"
              />
            </Tooltip>
          </div>
          <DatePicker
            defaultValue={data.dataVencimento}
            format={dateFormat}
            id="dataVencimento"
            name="dataVencimento"
            autoComplete="dataVencimento"
            onChange={(vl, dateString) => {
              handleChange("dataVencimento", dateString);
            }}
            className={`${
              !!errors.dataVencimento ? "AddCliente_inputError" : ""
            }`}
          />
          {errors.dataVencimento && (
            <div className="AddCliente_itemFieldError">
              {errors.dataVencimento}
            </div>
          )}
        </div>

        <Button
          className="Edit_Cliente_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <Button
          className="Edit_Cliente_deleteBtn"
          onClick={() => {
            navigate(`${links.DELETE_CLIENTE}/${id}`, {
              state: location.state,
            });
          }}
          disabled={isLoading}
        >
          EXCLUIR CLIENTE
        </Button>
        <Button
          className="Edit_Cliente_ResetBtn"
          onClick={() => {
            if (!isLoading) onNewPassword();
          }}
          disabled={isLoading}
        >
          <div className="Edit_Cliente_Reset_Icon_Title">
            <span>RESETAR SENHA</span>
          </div>
        </Button>
        <div style={{ marginTop: "10px" }}>{newPassword}</div>
      </div>
    </div>
  );
};

export default EditCliente;
