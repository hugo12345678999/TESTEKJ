import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import "./Trocar.css";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";

const Trocar = (props) => {
  const { authInfo, setNotiMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const [data, setData] = useState({
    novoId: "",
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
    if (data.novoId === "") {
      errorsTemp.novoId = "Este campo é obrigatório";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/recuperar-id-maquina/${id}`,
        { novoId: data.novoId },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: res?.data?.message,
        });
        navigate(
          `${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/${data.novoId}`,
          {
            state: location.state,
          }
        );
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
      <div>
        <div className="Trocar_header">
          <div className="Trocar_header_title">TROCAR O ID DESSA MAQUINA</div>
          <Button
            className="Trocar_header_back"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/${id}`, {
                state: location.state,
              });
            }}
          >
            <span>VOLTAR</span>
          </Button>
        </div>

        <div className="Trocar_content">
          <div className="Trocar_itemField">
            <label className="Trocar_itemFieldLabel" htmlFor="novoId">
              NOVO ID:
            </label>
            <Input
              placeholder={""}
              value={data.novoId}
              id="novoId"
              type="text"
              name="novoId"
              autoComplete="novoId"
              onChange={(event) => {
                handleChange("novoId", event.target.value);
              }}
              className={`${!!errors.novoId ? "Trocar_inputError" : ""}`}
            />
            {errors.novoId && (
              <div className="Trocar_itemFieldError">{errors.novoId}</div>
            )}
          </div>

          <Button
            className="Trocar_saveBtn"
            onClick={() => {
              if (!isLoading) onSave();
            }}
            disabled={isLoading}
          >
            ENVIAR
          </Button>
        </div>
      </div>
    </>
  );
};

export default Trocar;
