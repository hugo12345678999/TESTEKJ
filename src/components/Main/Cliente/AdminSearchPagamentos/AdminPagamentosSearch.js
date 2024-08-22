import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminPagamentosSearch.css";
import { Button, Table } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import * as links from "../../../../utils/links";
import {
  AiOutlineEdit,
  AiFillDelete,
  AiFillDollarCircle,
} from "react-icons/ai";
import qr_code_icon from "../../../../assets/images/QR.png";
import notes from "../../../../assets/images/notes.png";

const AdminPagamentosSearch = (props) => {
  const location = useLocation();
  const { maquinaInfos, clienteInfo } = location.state;

  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);

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
  const [estoque2, setEstoque2] = useState("");
  const [estoque3, setEstoque3] = useState("");
  const [estoque4, setEstoque4] = useState("");
  const [estoque5, setEstoque5] = useState("");
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
  }, [dataInicio, dataFim]);

  const getData = (id) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      axios
        .get(`${process.env.REACT_APP_SERVIDOR}/pagamentos-adm/${id}`, {
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
          setEstoque(res?.data?.estoque);
          setContadorCredito(res?.data?.contadorcredito);
          setContadorPelucia(res?.data?.contadorpelucia);
          setEstoque2(res?.data?.estoque2);
          setEstoque3(res?.data?.estoque3);
          setEstoque4(res?.data?.estoque4);
          setEstoque5(res?.data?.estoque5);
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
                "A sua sessão expirou, para continuar faça login novamente.",
            });
            setDataUser(null);
          }
        });
    }
  };

  const getPaymentsPeriod = (dataInicio, dataFim) => {
    if (id.trim() !== "") {
      setLoadingTable(true);
      const url = `${process.env.REACT_APP_SERVIDOR}/pagamentos-periodo-adm/${id}`;
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
      render: (tipo) => (
        <span>
          {tipo === "bank_transfer"
            ? "PIX"
            : tipo === "CASH"
            ? "Especie"
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

  const formatNumberWithLeadingZeros = (number, length) => {
    const numStr = number.toString();
    return numStr.padStart(length, "0");
  };

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "Selecione no calendario a esquerda a data de inicio e fim para gerar o relatorio para essa maquina!",
      });
    } else {
      navigate(`${links.RELATORIO_ADMIN}/${id}`, {
        state: { maquinaInfos, clienteInfo, dataInicio, dataFim },
      });
    }
  };

  return (
    <div className="Admin_PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="Admin_PagamentosSearch_header">
        <div className="Admin_PagamentosSearch_header_left">
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINAS_EDIT_FORNECEDOR}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINA_DELETE_PAGAMENTOS}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDelete />
            <span>Excluir Pagamentos</span>
          </Button>

          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINA_DELETE_PAGAMENTOS}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>Retorno Manual</span>
          </Button>

          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={onRelatorioHandler}
          >
            <img
              className="Admin_PagamentosSearch_qr_code"
              src={qr_code_icon}
              alt="qr_code_icon"
            />
            <span>Relatório</span>
          </Button>
        </div>

        <div className="Admin_PagamentosSearch_header_right">
          <RangePicker
            className="Admin_PagamentosSearch_rangePicker"
            format="DD/MM/YYYY"
            placeholder={["Início", "Fim"]}
            onChange={(dates, dateStrings) => {
              setDataInicio(dateStrings[0]);
              setDataFim(dateStrings[1]);
            }}
          />

          <Button
            className="Admin_PagamentosSearch_btn"
            onClick={() => {
              getPaymentsPeriod(dataInicio, dataFim);
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>

          <Button
            className="Admin_PagamentosSearch_btn"
            onClick={() => {
              getData(id);
              setDataInicio(null);
              setDataFim(null);
            }}
          >
            <FontAwesomeIcon icon={faArrowsRotate} />
          </Button>
        </div>
      </div>

      <div className="Admin_PagamentosSearch_body">
        <div className="Admin_PagamentosSearch_body_left">
          <div className="Admin_PagamentosSearch_titulo">Estatísticas</div>
          <div className="Admin_PagamentosSearch_info">
            <div className="Admin_PagamentosSearch_info_item">
              <label>Créditos: </label>
              <span className="Admin_PagamentosSearch_contador">
                {formatNumberWithLeadingZeros(contadorcredito, 4)}
              </span>
            </div>

            <div className="Admin_PagamentosSearch_info_item">
              <label>Pelúcias: </label>
              <span className="Admin_PagamentosSearch_contador">
                {formatNumberWithLeadingZeros(contadorpelucia, 4)}
              </span>
            </div>

            <div className="Admin_PagamentosSearch_info_item">
              <label>Dinheiro: </label>
              <span className="Admin_PagamentosSearch_contador">
                {cash
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(cash)
                  : "R$ 0,00"}
              </span>
            </div>
          </div>
        </div>
        <div className="Admin_PagamentosSearch_body_right">
          <Table
            dataSource={listCanals}
            columns={columns}
            pagination={{ pageSize: 10 }}
            loading={loadingTable}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPagamentosSearch;
