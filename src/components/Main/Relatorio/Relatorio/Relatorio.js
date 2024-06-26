import React, { useContext, useEffect, useState } from "react";
import "./Relatorio.css";
import { Col, Row, Button } from "antd";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import os_icon from "../../../../assets/images/OS.png";
import money_bag from "../../../../assets/images/money_bag.png";
import hand_money from "../../../../assets/images/hand_money.png";
import card from "../../../../assets/images/card.png";
import pix_icon from "../../../../assets/images/pix.png";
import credito_icon from "../../../../assets/images/credito.png";
import debito_icon from "../../../../assets/images/debito.png";
import especie_icon from "../../../../assets/images/especie.png";
import * as links from "../../../../utils/links";
import moment from "moment";

const Relatorio = (props) => {
  const { authInfo, setNotiMessage } = useContext(AuthContext);
  const { dataUser } = authInfo;
  let navigate = useNavigate();
  const location = useLocation();

  const { maquinaInfos, dataInicio, dataFim } = location.state;

  const { id } = useParams();

  const token = authInfo?.dataUser?.token;

  const [estornos, setEstornos] = useState({ SOMA: "0" });
  const [pagamentos, setPagamentos] = useState({
    PIX: "0",
    ESPECIE: "0",
    CREDITO: "0",
    DEBITO: "0",
  });
  const [taxas, setTaxas] = useState({
    PIX: "0",
    CREDITO: "0",
    DEBITO: "0",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataData();

    const intervalId = setInterval(() => {
      dataData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const dataData = async () => {
    try {
      setIsLoading(true);

      let body = { maquinaId: id };
      body.dataInicio = new Date(dataInicio.slice(0, 11) + "T00:00:00.000Z");
      body.dataFim =  new Date(dataFim.slice(0, 11) + "T23:59:00.000Z");

      const [estornosVal, taxasVal, pagamentosVal, cashVal] = await Promise.all(
        [
          axios.post(
            `${process.env.REACT_APP_SERVIDOR}/relatorio-04-estornos`,
            body,
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          ),
          axios.post(
            `${process.env.REACT_APP_SERVIDOR}/relatorio-02-taxas`,
            body,
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          ),
          axios.post(
            `${process.env.REACT_APP_SERVIDOR}/relatorio-03-pagamentos`,
            body,
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          ),
          axios.post(
            `${process.env.REACT_APP_SERVIDOR}/relatorio-01-cash`,
            body,
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          ),
        ]
      );
      setEstornos({
        SOMA: estornosVal?.data?.valor || "0",
      });

      setTaxas({
        PIX: taxasVal.data?.pix || "0",
        CREDITO: taxasVal.data?.credito || "0",
        DEBITO: taxasVal.data?.debito || "0",
      });

      setPagamentos({
        PIX: pagamentosVal.data.pix || "0",
        CREDITO: pagamentosVal.data.credito || "0",
        DEBITO: pagamentosVal.data.debito || "0",
        ESPECIE: cashVal.data?.valor || "0",
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      setNotiMessage({
        type: "error",
        message: "A sua sessão expirou, para continuar faça login novamente.",
      });
    }
  };

  return (
    <div>
      {isLoading && <LoadingAction />}
      <div className="Cliente_WarningMsgSpan">
        <span>{dataUser.warningMsg}</span>
      </div>
      <div className="Relatorio_main">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className="Relatorio_staBlockTitle">
            <span>Relatório Máquina: {id}</span>
            <br />
            <span style={{ color: "grey", fontSize: "15px" }}>
              {moment(new Date(dataInicio)).format("DD/MM/YYYY")} -{" "}
              {moment(new Date(dataFim)).format("DD/MM/YYYY")} -{" "}
              {maquinaInfos.nome}
            </span>
          </div>
          <div className="Relatorio_staBlockTitle">
            Gerado em: {moment(new Date()).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
        <Button
          className="Help_Page_header_back"
          onClick={() => {
            navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, {
              state: maquinaInfos,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <Row>
        <Col xs={24} md={22} lg={22} xl={22}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Pagamentos</div>

              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_title_row">
                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={pix_icon}
                      alt="PIX"
                    />
                    PIX
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={especie_icon}
                      alt="ESPÉCIE"
                    />
                    ESPÉCIE
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={credito_icon}
                      alt="CRÉDITO"
                    />
                    CRÉDITO
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={debito_icon}
                      alt="DÉBITO"
                    />
                    DÉBITO
                  </Col>
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={6}>{pagamentos?.PIX}</Col>
                  <Col span={6}>{pagamentos?.ESPECIE}</Col>
                  <Col span={6}>{pagamentos?.CREDITO}</Col>
                  <Col span={6}>{pagamentos?.DEBITO}</Col>
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_os_icon" src={os_icon} alt="os icon" />
              <br />
              <br />
              <br />
              <img
                className="Relatorio_money_icon"
                src={money_bag}
                alt="os icon"
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={22} lg={22} xl={11}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Estornos</div>
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_title_row">
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={pix_icon}
                      alt="TOTAL DE ESTORNOS"
                    />
                    TOTAL DE ESTORNOS
                  </Col>
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={12}>{estornos?.SOMA}</Col>
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_os_icon" src={os_icon} alt="os icon" />
              <br />
              <br />
              <br />
              <img className="Relatorio_money_icon" src={card} alt="os icon" />
            </div>
          </div>
        </Col>
        <Col xs={24} md={22} lg={22} xl={11}>
          <div className="Relatorio">
            <div className="Relatorio_left_side">
              <div className="Relatorio_title">Taxas</div>
              <div className="Relatorio_inner_rows">
                <Row className="Relatorio_title_row">
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={pix_icon}
                      alt="TOTAL DE ESTORNOS"
                    />
                    PIX
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={credito_icon}
                      alt="CRÉDITO"
                    />
                    CRÉDITO
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className="Relatorio_title_col"
                  >
                    <img
                      className="Relatorio_title_col_title"
                      src={debito_icon}
                      alt="DÉBITO"
                    />
                    DÉBITO
                  </Col>
                </Row>
                <Row className="Relatorio_value_row">
                  <Col span={8}>{taxas?.PIX}</Col>
                  <Col span={8}>{taxas?.CREDITO}</Col>
                  <Col span={8}>{taxas?.DEBITO}</Col>
                </Row>
              </div>
            </div>
            <div className="Relatorio_right_side">
              <img className="Relatorio_os_icon" src={os_icon} alt="os icon" />
              <br />
              <br />
              <br />
              <img
                className="Relatorio_money_icon"
                src={hand_money}
                alt="os icon"
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Relatorio;
