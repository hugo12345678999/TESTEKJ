import React, { useContext, useState } from "react";
import { Button, Input, DatePicker, Tooltip } from "antd";
import "./AddMaquina.css";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import * as links from "../../../../utils/links";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import question_icon from "../../../../assets/images/question.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const AddMaquina = (props) => {
  const { authInfo, setDataUser, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { maquinaInfos, clienteInfo } = location.state;

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const [data, setData] = useState({
    nome: "",
    descricao: "",
    valorDoPix: "",
    valorDoPulso: "",
    store_id: "",
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
    //   errorsTemp.valorDoPix = "Este campo é obrigatório";
    // }
    if (data.valorDoPulso.trim() === "") {
      errorsTemp.valorDoPulso = "Este campo é obrigatório";
    }
    if (data.store_id.trim() === "") {
      errorsTemp.store_id = "Este campo é obrigatório";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/maquina`,
        {
          nome: data.nome,
          descricao: data.descricao,
          valorDoPix: data.valorDoPix,
          clienteId: id,
          valorDoPulso: data.valorDoPulso,
          store_id: data.store_id,
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
        navigate(`${links.CLIENTES_MAQUINAS}/${id}`, {
          state: location.state,
        });
      })
      .catch((err) => {
        setIsLoading(false);

        setNotiMessage({
          type: "error",
          message: err.response?.data?.error
            ? err.response?.data?.error
            : `A sua sessão expirou, para continuar faça login novamente.`,
        });
      });
  };

  return (
    <>
      {isLoading && <LoadingAction />}
      <div className="AddMaquina_container">
        <div className="AddMaquina_header">
          <div className="AddMaquina_header_title">Adicionar Maquina</div>

          <Button
            className="AddMaquina_header_back"
            onClick={() =>
              navigate(`${links.CLIENTES_MAQUINAS}/${id}`, {
                state: location.state,
              })
            }
          >
            VOLTAR
          </Button>
        </div>
        <div className="AddMaquina_content">
          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="nome">
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
              className={`${!!errors.nome ? "AddMaquina_inputError" : ""}`}
            />
            {errors.nome && (
              <div className="AddMaquina_itemFieldError">{errors.nome}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="descricao">
              Descricao:
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
              className={`${!!errors.descricao ? "AddMaquina_inputError" : ""}`}
            />
            {errors.descricao && (
              <div className="AddMaquina_itemFieldError">
                {errors.descricao}
              </div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <div className="AddMaquina_Label_Icon">
              <label className="AddMaquina_itemFieldLabel" htmlFor="store_id">
                Store_id
              </label>
              <img
                src={question_icon}
                alt="question icon"
                className="AddMaquina_Icon"
                onClick={() =>
                  navigate(links.TOKEN_HELP_PAGE, {
                    state: {
                      redirect_url: `${links.ADD_CLIENTES_MAQUINA_ADM}/${id}`,
                    },
                  })
                }
              />
            </div>
            <Input
              placeholder={""}
              value={data.store_id}
              id="store_id"
              type="number"
              name="store_id"
              autoComplete="store_id"
              onChange={(event) => {
                handleChange("store_id", event.target.value);
              }}
              className={`${!!errors.store_id ? "AddMaquina_inputError" : ""}`}
            />
            {errors.store_id && (
              <div className="AddMaquina_itemFieldError">{errors.store_id}</div>
            )}
          </div>

          <div className="AddMaquina_itemField">
            <label className="AddMaquina_itemFieldLabel" htmlFor="valorDoPulso">
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
                !!errors.valorDoPulso ? "AddMaquina_inputError" : ""
              }`}
            />
            {errors.valorDoPulso && (
              <div className="AddMaquina_itemFieldError">
                {errors.valorDoPulso}
              </div>
            )}
          </div>
          <Button
            className="AddMaquina_saveBtn"
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

export default AddMaquina;
