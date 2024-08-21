import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./PagamentosSearch.css";
import { Button, Table } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
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

const { RangePicker } = DatePicker;

const formatNumberWithLeadingZeros = (number, length) => {
  return number ? number.toString().padStart(length, '0') : '-';
};

const PagamentosSearch = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listCanals, setListCanals] = useState([]);
  const [estornos, setEstornos] = useState("");
  const [probabilidade, setProbabilidade] = useState("");
  const [estoque, setEstoque] = useState("");
  const [contadorCredito, setContadorCredito] = useState("");
  const [contadorPelucia, setContadorPelucia] = useState("");
  const [cash, setCash] = useState("");
  const [total, setTotal] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    getData(id);
  }, [id]);

  useEffect(() => {
    if (dataFim != null) {
      getPaymentsPeriod(dataInicio, dataFim);
    }
  }, [dataFim]);

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
          setCash(res.data.cash);
          setProbabilidade(res.data.probabilidade);
          setEstoque(res.data.estoque);
          setContadorCredito(res.data.contadorcredito);
          setContadorPelucia(res.data.contadorpelucia);
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
              message: "A sua sessão expirou, para continuar faça login novamente.",
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
          setCash(res.data.cash);
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
              message: "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        });
    }
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      width: 500,
      render: (data) => <span>{moment(data).format("DD/MM/YYYY HH:mm:ss")}</span>,
    },
    {
      title: "Forma de pagamento",
      dataIndex: "tipo",
      key: "tipo",
      render: (tipo) => (
        <span>
          {tipo === "bank_transfer" ? "PIX" :
           tipo === "CASH" ? "Espécie" :
           tipo === "debit_card" ? "Débito" :
           tipo === "credit_card" ? "Crédito" :
           ""}
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
                {record.motivoEstorno ? record.motivoEstorno : "Sem motivo registrado"}
              </Tooltip>
            }
          >
            <span style={{ color: "gray", cursor: "pointer" }}>
              Estornado
            </span>
          </OverlayTrigger>
        ) : (
          <span style={{ color: "green" }}>Recebido</span>
        ),
    },
  ];

  const onRelatorioHandler = () => {
    if (!dataInicio || !dataFim) {
      setNotiMessage({
        type: "error",
        message: "Selecione a data de início e fim para gerar o relatório!",
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
            onClick={() => navigate(`${links.EDIT_FORNECEDOR_CANAIS}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Editar</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => navigate(`${links.DELETE_FORNECEDOR_CANAIS}/${id}`, { state: location.state })}
          >
            <AiFillDelete />
            <span>Excluir Pagamentos</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => navigate(links.REMOTE_CREDIT.replace(":id", id), { state: location.state })}
          >
            <AiFillDollarCircle />
            <span>Crédito Remoto</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => navigate(`${links.GRUA_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Configurar Grua</span>
          </Button>
          
          <div className="PagamentosSearch_datePicker">
            <FontAwesomeIcon
              style={{ marginBottom: "10px", marginRight: "10px" }}
              icon={faSearch}
              onClick={() => getPaymentsPeriod(dataInicio, dataFim)}
            />
            <RangePicker
              style={{ border: "1px solid", borderRadius: "4px" }}
              placeholder={["Data Inicial", "Data Final"]}
              onChange={(dates, dateStrings) => {
                setDataInicio(dateStrings ? dateStrings[0] : null);
                setDataFim(dateStrings ? dateStrings[1] : null);
              }}
            />
          </div>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => onRelatorioHandler()}
          >
            <img
              style={{ width: "15px", marginRight: "2px" }}
              src={notes}
              alt="notes"
            />
            <span>Relatório</span>
          </Button>
        </div>
        <Link
          className="PagamentosSearch_header_back"
          to={links.DASHBOARD_FORNECEDOR}
        >
          VOLTAR
        </Link>
      </div>
      <div className="PagamentosSearch_body">
        <div className="PagamentosSearch_content">
          <div
            className="PagamentosSearch_titleList_main"
            style={{ marginBottom: "10px" }}
          >
            <div className="PagamentosSearch_titleList">
              <div style={{ marginLeft: "20px" }}>Total</div>
              <div className="PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(total)}
              </div>
              <div style={{ marginLeft: "20px" }}>Estornos</div>
              <div className="PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(estornos)}
              </div>
              <div style={{ marginLeft: "20px" }}>Espécie</div>
              <div className="PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(cash)}
              </div>
              <div style={{ marginLeft: "20px" }}>Store ID</div>
              <div className="PagamentosSearch_nbList">
                {formatNumberWithLeadingZeros(maquinaInfos.storeId, 5)}
              </div>
              <div style={{ marginLeft: "1px" }}>Saída de Pelúcia</div>
              <div className="PagamentosSearch_nbList">{estoque ?? "-"}</div>
              <div style={{ marginLeft: "1px" }}>Relógio Crédito</div>
              <div className="PagamentosSearch_nbList">{contadorCredito ?? "-"}</div>
              <div style={{ marginLeft: "1px" }}>Relógio Pelúcia</div>
              <div className="PagamentosSearch_nbList">{contadorPelucia ?? "-"}</div>
            </div>
            {maquinaInfos.storeId && (
              <Link
                target="_blank"
                to={`//www.mercadopago.com.br/stores/detail?store_id=${maquinaInfos.storeId}`}
              >
                <img
                  className="PagamentosSearch_QR_Icon"
                  src={qr_code_icon}
                  alt="QR"
                />
              </Link>
            )}
          </div>
          <div className="PagamentosSearch_description">{`${maquinaInfos?.nome} - ${maquinaInfos?.descricao}`}</div>

          <Table
            columns={columns}
            dataSource={listCanals}
            pagination={false}
            loading={loadingTable}
            locale={{
              emptyText: searchText.trim() !== "" ? "-" : "Não foram encontrados resultados para sua pesquisa.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PagamentosSearch;
