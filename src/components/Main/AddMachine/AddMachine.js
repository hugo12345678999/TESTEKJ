import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import "./AddMachine.css";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as links from "../../../utils/links";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import question_icon from "../../../assets/images/question.png";

const AddMachine = (props) => {
  const { authInfo, setDataUser, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [data, setData] = useState({
    nome: "",
    descricao: "",
    valorDoPix: "",
    store_id: 0,
    valorDoPulso: 0,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }
    // if (data.valorDoPix.trim() === "") {
    //     errorsTemp.valorDoPix = 'Este campo é obrigatório'
    // }
    if (data.valorDoPulso < 0) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório";
    }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          nome: data.nome,
          descricao: data.descricao,
          valorDoPix: data.valorDoPix,
          valorDoPulso: data.valorDoPulso,
          store_id: String(data.store_id),
        },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate(links.DASHBOARD_FORNECEDOR);
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          // setNotiMessage('A sua sessão expirou, para continuar faça login novamente.');
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
          setDataUser(null);
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
  return (
    <>
      {isLoading && <LoadingAction />}
      <div className="AddMachine_container">
        <div className="AddMachine_header">
          <div className="AddMachine_header_title">Adicionar Máquina</div>
          <Link
            className="AddMachine_header_back"
            to={links.DASHBOARD_FORNECEDOR}
          >
            VOLTAR
          </Link>
        </div>
        <div className="AddMachine_content">
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="nome">
              Nome:
            </label>
            <Input
              placeholder={""}
              value={data.nome}
              id="nome"
              type="text"
              name="nome"
              autoComplete="nome"
              onChange={(event) => {
                handleChange("nome", event.target.value);
              }}
              className={`${!!errors.nome ? "AddMachine_inputError" : ""}`}
            />
            {errors.nome && (
              <div className="AddMachine_itemFieldError">{errors.nome}</div>
            )}
          </div>
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="descricao">
              Descricão:
            </label>
            <Input
              placeholder={""}
              value={data.descricao}
              id="descricao"
              type="text"
              name="descricao"
              autoComplete="descricao"
              onChange={(event) => {
                handleChange("descricao", event.target.value);
              }}
              className={`${!!errors.descricao ? "AddMachine_inputError" : ""}`}
            />
            {errors.descricao && (
              <div className="AddMachine_itemFieldError">
                {errors.descricao}
              </div>
            )}
          </div>
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="store_id">
              Store_id:
            </label>
            <Button
              className="EditPagamentos_header_HelpPage"
              onClick={() => {
                navigate(links.HELP_PAGE, {
                  state: { redirect_url: `${links.ADD_MACHINE}` },
                });
              }}
              disabled={isLoading}
            >
              <img
                className="Edit_Pagamento_Icon"
                src={question_icon}
                alt="question icon"
              />
            </Button>
            <Input
              placeholder={""}
              value={data.store_id}
              id="store_id"
              name="store_id"
              min={0}
              autoComplete="store_id"
              onChange={(event) => {
                handleChange("store_id", event.target.value);
              }}
              className={`${!!errors.store_id ? "AddMachine_inputError" : ""}`}
            />
            {errors.store_id && (
              <div className="AddMachine_itemFieldError">{errors.store_id}</div>
            )}
          </div>
          <div className="AddMachine_itemField">
            <label className="AddMachine_itemFieldLabel" htmlFor="valorDoPulso">
              Valor Do Pulso R$:
            </label>
            <Input
              placeholder={""}
              value={data.valorDoPulso}
              id="valorDoPulso"
              type="number"
              name="valorDoPulso"
              autoComplete="valorDoPulso"
              onChange={(event) => {
                handleChange("valorDoPulso", event.target.value);
              }}
              className={`${
                !!errors.valorDoPulso ? "AddMachine_inputError" : ""
              }`}
            />
            {errors.valorDoPulso && (
              <div className="AddMachine_itemFieldError">
                {errors.valorDoPulso}
              </div>
            )}
          </div>
          <Button
            className="AddMachine_saveBtn"
            onClick={() => {
              if (!isLoading) onSave();
            }}
            disabled={isLoading}
          >
            SALVAR
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddMachine;
