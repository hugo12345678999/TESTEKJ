import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { AiOutlineEdit, AiFillDelete, AiFillDollarCircle } from "react-icons/ai";
import * as links from "../../../../utils/links";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const GruaManualAdm = (props) => {
  const location = useLocation();
  const { maquinaInfos, clienteInfo } = location.state;
  const { id } = useParams();
  let navigate = useNavigate();

  const botaomanualprobabilidade = () => {
    navigate(`${links.EDIT_GARRA_MANUAL_PROBABILIDADE_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarramanualforte = () => {
    navigate(`${links.EDIT_GARRA_MANUAL_GARRA_FORTE_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarramanualmedia = () => {
    navigate(`${links.EDIT_GARRA_MANUAL_GARRA_MEDIA_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarramanualfraca = () => {
    navigate(`${links.EDIT_GARRA_MANUAL_GARRA_FRACA_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarramanualpremio = () => {
    navigate(`${links.EDIT_GARRA_MANUAL_GARRA_PREMIO_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };


  return (
    <div className="Admin_PagamentosSearch_container">
      <div className="Admin_PagamentosSearch_header">
        <div className="Admin_PagamentosSearch_header_left">
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaomanualprobabilidade}
          >
            <AiOutlineEdit />
            <span>ALTERAR PROBABILIDADE</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarramanualforte}
          >
            <AiOutlineEdit />
            <span>ALTERAR FORCA FORTE</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarramanualmedia}
          >
            <AiOutlineEdit />
            <span>ALTERAR FORCA MEDIA</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarramanualfraca}
          >
            <AiOutlineEdit />
            <span>ALTERAR FORCA FRACA</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarramanualpremio}
          >
            <AiOutlineEdit />
            <span>ALTERAR FORCA PREMIO</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_back"
            onClick={() =>
              navigate(`${links.CLIENTES_MAQUINAS}/${clienteInfo.id}`, {
                state: location.state.clienteInfo,
              })
            }
          >
            VOLTAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GruaManualAdm;