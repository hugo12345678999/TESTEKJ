import React, { useCallback, useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./PagamentosSearch.css";
import { Button, Col, Input, Row, Table } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as links from "../../../utils/links";
import {
  AiOutlineEdit,
  AiFillDelete,
  AiFillDollarCircle,
} from "react-icons/ai";
import qr_code_icon from "../../../assets/images/QR.png";
import notes from "../../../assets/images/notes.png";

const PagamentosSearch = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, loading, authInfo, setNotiMessage } =
    useContext(AuthContext);
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listCanals, setListCanals] = useState([]);
  const [estornos, setEstornos] = useState("");
  const [probabilidade, setprobabilidade] = useState("");
  const [estoque, setEstoque] = useState("");
  const [contadorcredito, setContadorCredito] = useState("");
  const [contadorpelucia, setContadorPelucia] = useState("");
  const [cash, setCash] = useState("");
  const [total, setTotal] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [dataMaquinas, setDataMaquinas] = useState(null);

  const { id } = useParams();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    getData(id);
  }, [id]);

  useEffect(() => {
    if (dataFim != null) {
      getPaymentsPeriod(dataInicio, dataFim);
    }
  }, [dataInicio, dataFim, id]);

  const getData = (id) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      axios
        .get(`${process.env.REACT_APP_SERVIDOR}/pagamentos/${id}`, {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        })
        .then((res) => {
          setLoadingTable(false);
          setEstornos(res.data.estornos);
          setCash(res?.data?.cash);
          setprobabilidade(res?.data?.probabilidade);
          setEstoque(formatToSixDigits(res?.data?.estoque));
          setContadorCredito(res?.data?.contadorcredito);
          setContadorPelucia(res?.data?.contadorpelucia);
          setTotal(res.data.total);
          if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
            setListCanals(res.data.pagamentos);
          }
        })
        .catch((err) => {
          setLoadingTable(false);
          if ([401, 403].includes(err.response.status)) {
            setNotiMessage({
              type: "error",
              message:
                "A sua sessão expirou, para continuar faça login novamente..",
            });
            setDataUser(null);
          }
        });
    }
  };

  const getPaymentsPeriod = (dataInicio, dataFim) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      const url = `${process.env.REACT_APP_SERVIDOR}/pagamentos-periodo/${id}`;
      axios
        .post(
          url,
          {
            dataInicio: dataInicio + "T00:00:00.000Z",
            dataFim: dataFim + "T23:59:00.000Z",
          },
          {
            headers: {
              "x-access-token": token,
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          setLoadingTable(false);
          setEstornos(res.data.estornos);
          setCash(res?.data?.cash);
          setTotal(res.data.total);
          setEstoque(formatToSixDigits(res?.data?.estoque));
          if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
            setListCanals(res.data.pagamentos);
          }
        })
        .catch((err) => {
          setLoadingTable(false);
          if ([401, 403].includes(err.response.status)) {
            setNotiMessage({
              type: "error",
              message:
                "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        });
    }
  };

  const formatToSixDigits = (value) => {
    return value ? String(value).padStart(6, '0') : '000000';
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 500,
      render: (data) => (
        <span>{moment(data).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "Forma de pagamento",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo, record) => (
        <span>
          {tipo === "bank_transfer"
            ? "PIX"
            : tipo === "CASH"
            ? "Espécie"
            : tipo === "debit_card"
            ? "Débito"
            : tipo === "credit_card"
            ? "Crédito"
            : ""}
        </span>
      ),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (valor) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor),
    },
    {
      title: "Identificador MP",
      dataIndex: "mercadoPagoId",
      key: "mercadoPagoId",
    },
    {
      title: "Estornado",
      dataIndex: "estornado",
      key: "estornado",
      width: 100,
      render: (estornado, record) =>
        estornado ? (
          <OverlayTrigger
            key={record.key}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-top-${record.key}`}>
                {record.motivoEstorno
                  ? record.motivoEstorno
                  : "Sem motivo registrado"}
              </Tooltip>
            }
          >
            <span style={{ color: "gray", cursor: "pointer" }}>
              {estornado ? "Estornado" : "Recebido"}
            </span>
          </OverlayTrigger>
        ) : (
          <span style={{ color: estornado ? "gray" : "green" }}>
            {estornado ? "Estornado" : "Recebido"}
          </span>
        ),
    },
  ];

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "Selecione no calendário a esquerda a data de início e fim para gerar o relatório para essa máquina!",
      });
    } else {
      navigate(`${links.RELATORIO}/${id}`, {
        state: { maquinaInfos, dataInicio, dataFim },
      });
    }
  };

  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">{maquinaInfos?.nome}</div>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.EDIT_FORNECEDOR_CANAIS}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.DELETE_FORNECEDOR_CANAIS}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDelete />
            <span>Excluir Pagamentos</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(links.REMOTE_CREDIT.replace(":id", id), {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>Crédito Remoto</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.GRUA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>Cliente GRUA</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>Visualizar Cliente</span>
          </Button>
        </div>
        <div className="PagamentosSearch_header_right">
          <div className="PagamentosSearch_header_right_date">
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(dates, dateStrings) => {
                if (dates) {
                  setDataInicio(dateStrings[0]);
                  setDataFim(dateStrings[1]);
                } else {
                  setDataInicio(null);
                  setDataFim(null);
                }
              }}
            />
            <Button
              className="PagamentosSearch_header_right_button"
              onClick={onRelatorioHandler}
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>Buscar</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="PagamentosSearch_stats">
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>SAIDA DE PELUCIA</div>
          <div className="PagamentosSearch_nbList">{estoque ?? "-"}</div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL ESTORNOS</div>
          <div className="PagamentosSearch_nbList">
            {estornos ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(estornos) : "-"}
          </div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL CASH</div>
          <div className="PagamentosSearch_nbList">
            {cash ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cash) : "-"}
          </div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL PROBABILIDADE</div>
          <div className="PagamentosSearch_nbList">
            {probabilidade ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(probabilidade) : "-"}
          </div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL CONTADOR CRÉDITO</div>
          <div className="PagamentosSearch_nbList">
            {contadorcredito ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(contadorcredito) : "-"}
          </div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL CONTADOR PELÚCIA</div>
          <div className="PagamentosSearch_nbList">
            {contadorpelucia ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(contadorpelucia) : "-"}
          </div>
        </div>
        <div className="PagamentosSearch_statItem">
          <div style={{ marginLeft: "1px" }}>TOTAL</div>
          <div className="PagamentosSearch_nbList">
            {total ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total) : "-"}
          </div>
        </div>
      </div>
      <div className="PagamentosSearch_table">
        <Table
          columns={columns}
          dataSource={listCanals}
          loading={loadingTable}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default PagamentosSearch;
