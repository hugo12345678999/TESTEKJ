import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { AiOutlineEdit, AiFillDelete, AiFillDollarCircle } from "react-icons/ai";
import * as links from "../../../../utils/links";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const GruaAdm = (props) => {
  const location = useLocation();
  const { maquinaInfos, clienteInfo } = location.state;
  const { id } = useParams();
  let navigate = useNavigate();

  const botaoprobabilidade = () => {
    navigate(`${links.EDIT_PROBABILIDADE_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarraforte = () => {
    navigate(`${links.EDIT_GARRA_FORTE_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarramedia = () => {
    navigate(`${links.EDIT_GARRA_MEDIA_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarrafraca = () => {
    navigate(`${links.EDIT_GARRA_FRACA_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };
  const botaogarrapremio = () => {
    navigate(`${links.EDIT_GARRA_PREMIO_ADM}/${maquinaInfos.id}`, {
      state: location.state,
    });
  };


  return (
    <div className="Admin_PagamentosSearch_container">
      <div className="Admin_PagamentosSearch_header">
        <div className="Admin_PagamentosSearch_header_left">
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaoprobabilidade}
          >
            <AiOutlineEdit />
            <span>PROBABILIDADE</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarraforte}
          >
            <AiOutlineEdit />
            <span>FORCA FORTE</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarramedia}
          >
            <AiOutlineEdit />
            <span>FORCA MEDIA</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarrafraca}
          >
            <AiOutlineEdit />
            <span>FORCA FRACA</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={botaogarrapremio}
          >
            <AiOutlineEdit />
            <span>FORCA PREMIO</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_ADM}/${maquinaInfos.id}`, {
                state: location.state,
              });
            }}
          >
           <AiOutlineEdit />
            <span>CONFIGURAR GRUA</span>
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

export default GruaAdm;