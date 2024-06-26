import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { Button, Col, Modal, Row, Table } from "antd";
import axios from "axios";
import * as links from "../../../utils/links";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AiOutlinePlusCircle } from "react-icons/ai";

const DashboardFornecedor = (props) => {
  const { setDataUser, loading, authInfo, setNotiMessage } =
    useContext(AuthContext);
  const { dataUser } = authInfo;
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const premiumExpiration = authInfo?.dataUser?.premiumExpiration ?? null;
  const hasData = !!authInfo?.dataUser?.hasData;
  const [favorites, setFavorites] = useState([]);
  const [meusFits, setMeusFits] = useState(null);
  const [totalCanais, setTotalCanais] = useState(null);
  const [totalFornecedores, setTotalFornecedores] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataCurrentDetail, setDataCurrentDetail] = useState(null);

  // useEffect(() => {
  //     dataData();
  // }, [])

  useEffect(() => {
    dataData();

    const intervalId = setInterval(() => {
      dataData();
    }, 60000);

    // Limpar o intervalo quando o componente for desmontado para evitar vazamento de memória
    return () => clearInterval(intervalId);
  }, []);

  const dataData = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/maquinas`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setTotalFornecedores(res.data);
        } else {
          throw new Error();
        }
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
        }
      });
  };

  const handleMaquinaClick = (id, nome, storeId, pulso, estoque, descricao) => {
    const maquinaInfos = { nome, storeId, pulso, estoque, descricao };
    navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, {
      state: maquinaInfos,
    });
  };

  return (
    <div className="Dashboard_container">
      {isLoading && <LoadingAction />}
      {/* <div className="WarningMsg">
                    {dataUser.warningMsg}
                </div> */}
      <div className="WarningMsgSpan">
        <span>{dataUser.warningMsg}</span>
      </div>
      <div className="Dashboard_header">
        <div className="Dashboard_staBlockTitle">Monitoramento</div>
        {/*<Button className="Dashboard_addbtn">*/}
        {/*    <AiOutlinePlusCircle />*/}
        {/*    <span>Addcionar Máquina</span>*/}
        {/*</Button>*/}
      </div>
      <div className="Dashboard_action">
        <Button style={{ margin: "0 15px" }} onClick={dataData}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>
       
      </div>
      <Row>
        {totalFornecedores.map((post) => (
          <Col xs={24} md={24} lg={8} xl={8} className="Dashboard_col">
            <div
              className="maquina"
              key={post.id}
              onClick={() =>
                handleMaquinaClick(
                  post.id,
                  post.nome,
                  post.store_id,
                  post.pulso,
                  post.estoque,
                  post.descricao
                )
              }
            >
              <div className="maquina-info">
                {(() => {
                  switch (post.status) {
                    case "ONLINE":
                      return (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color={"green"}
                          className="logout-icon fa-3x"
                        />
                      );
                    case "OFFLINE":
                      return (
                        <FontAwesomeIcon
                          icon={faXmarkCircle}
                          color={"red"}
                          className="logout-icon fa-3x"
                        />
                      );
                    case "PAGAMENTO_RECENTE":
                      return (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color={"blue"}
                          className="logout-icon fa-3x"
                        />
                      );
                    default:
                      return null;
                  }
                })()}
                <h2>{post.nome}</h2>
                <h4 style={{ fontWeight: "300" }}>
                  {post.status} - {post.descricao}
                </h4>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardFornecedor;
