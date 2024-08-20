import React, { useCallback, useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./PagamentosSearch.css";
import { Button, Col, Input, Row, Table } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import _, { debounce } from "lodash";
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
  // const [searchText, setsearchText] = useState('');
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

  // const []
  const { id } = useParams();
  const { RangePicker } = DatePicker;
  useEffect(() => {
    getData(id);
    // getMaquinas(id)
  }, []);

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
          setCash(res?.data?.cash);
          setprobabilidade(res?.data?.probababilidade);
          setEstoque(res?.data?.estoque);
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
            // setNotiMessage('A sua sessão expirou, para continuar faça login novamente.');
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

  const getMaquinas = (id) => {
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/maquinas`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          const maquinasData = res.data.find((item) => item.id === id);
          setDataMaquinas(maquinasData ?? null);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {});
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
          if (res.status === 200 && Array.isArray(res.data.pagamentos)) {
            setListCanals(res.data.pagamentos);
          }
        })
        .catch((err) => {
          setLoadingTable(false);
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
      render: (tipo, record) => (
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

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "selecione no calendario a esquerda a data de inicio e firm para gerar o relatorio para essa maquina!",
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
          {/*<Link to={links.REMOTE_CREDIT.replace(':id', id)}>*/}
          {/*   */}
          {/*</Link>*/}
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(links.REMOTE_CREDIT.replace(":id", id), {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>credito remoto</span>
          </Button>
          <Button
            className="PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.GRUA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>CONFIGURAR GRUA</span>
          </Button>
          
          <div className="PagamentosSearch_datePicker">
            {/* <span> Filtro por data:</span> */}
            <FontAwesomeIcon
              style={{ marginBottom: "10px", marginRight: "10px" }}
              icon={faSearch}
              onClick={() => getPaymentsPeriod(dataInicio, dataFim)}
            ></FontAwesomeIcon>
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
              <div className="PagamentosSearch_nbList">{maquinaInfos.storeId}
              </div>
              <div style={{ marginLeft: "1px" }}>SAIDA DE PELUCIA</div>
              <div className="PagamentosSearch_nbList">{estoque ?? "-"}</div>
              <div style={{ marginLeft: "1px" }}>CONTADOR CREDITO</div>
              <div className="PagamentosSearch_nbList">{contadorcredito ?? "-"}</div>
              <div style={{ marginLeft: "1px" }}>CONTADOR PELUCIA</div>
              <div className="PagamentosSearch_nbList">{estoque ?? "-"}</div>
             
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
              emptyText:
                searchText.trim() !== "" ? (
                  "-"
                ) : (
                  <div>Não foram encontrados resultados para sua pesquisa.</div>
                ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PagamentosSearch;
