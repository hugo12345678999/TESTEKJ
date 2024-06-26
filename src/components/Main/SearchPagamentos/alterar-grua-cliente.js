import React, { useContext } from "react";
import { Button } from "antd";
import { AiOutlineEdit, AiFillDelete, AiFillDollarCircle } from "react-icons/ai";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import * as links from "../../../utils/links";
import { AuthContext } from "../../../contexts/AuthContext";

const AlterarGruaCliente = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { id } = useParams();
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;



  return (
    <div className="PagamentosSearch_container">
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_PROBABILIDADE_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
          <AiOutlineEdit />
            <span>ALTERAR PROBABIBILIDADE</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_GARRA_FORTE_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>ALTERAR GARRA FORTE</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_GARRA_MEDIA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
           <AiOutlineEdit />
            <span>ALTERAR GARRA MEDIA</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_GARRA_FRACA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
             <AiOutlineEdit />
            <span>ALTERAR GARRA FRACA</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MANUAL_GARRA_PREMIO_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
             <AiOutlineEdit />
            <span>ALTERAR GARRA PREMIO</span>
          </Button>
        </div>
        <Link
          className="PagamentosSearch_header_back"
          to={links.DASHBOARD_FORNECEDOR}
        >
          VOLTAR
        </Link>
      </div>
    </div>
  );
};

export default AlterarGruaCliente;