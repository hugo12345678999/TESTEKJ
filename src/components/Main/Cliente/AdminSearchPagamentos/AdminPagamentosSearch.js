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
        .get(`${process.env.REACT_APP_SERVIDOR}/pagamentos-adm/${id}`, {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data); // Verificar a estrutura dos dados recebidosjgit
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
          "Selecione no calendario a esquerda a data de inicio e fi para gerar o relatorio para essa maquina!",
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
              navigate(`${links.CREDITO_REMOTO_ADM}/${maquinaInfos.id}`, {
                state: location.state,
              });
            }}
          >
            <AiFillDollarCircle />
            <span>credito remoto</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.GRUA_ADM}/${maquinaInfos.id}`, {
                state: location.state,
              });
            }}
          >
           <AiOutlineEdit />
            <span>CONFIGURAR GRUA</span>
          </Button>
          
          <div className="Admin_PagamentosSearch_datePicker">
            <FontAwesomeIcon
              style={{ marginBottom: "2px", marginRight: "2px" }}
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
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => onRelatorioHandler()}
          >
            <img
              style={{ width: "2px", marginRight: "2px" }}
              src={notes}
              alt="notes"
            />
            <span>Relatório</span>
          </Button>
          <Button
            className="Admin_PagamentosSearch_header_editBtn"
            onClick={() => {
              navigate(`${links.CLIENTES_MAQUINAS_TROCAR}/${id}`, {
                state: location.state,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              style={{ marginRight: "2px" }}
            />
            <span>ID</span>
          </Button>
        </div>
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
      <div className="Admin_PagamentosSearch_body">
        <div className="Admin_PagamentosSearch_content">
          <div
            className="Admin_PagamentosSearch_titleList_main"
            style={{ marginBottom: "2px" }}
          >
            <div className="Admin_PagamentosSearch_titleList">
              <div style={{ marginLeft: "2px" }}>Total</div>
              <div className="Admin_PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(total)}
              </div>
              <div style={{ marginLeft: "1px" }}>Estornos</div>
              <div className="Admin_PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(estornos)}
              </div>
              <div style={{ marginLeft: "1px" }}>Espécie</div>
              <div className="Admin_PagamentosSearch_nbList">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(cash)}
              </div>

              <div style={{ marginLeft: "1px" }}>ID</div>
              <div className="Admin_PagamentosSearch_nbList">
                {maquinaInfos.store_id}
              </div>
             
              <div style={{ marginLeft: "1px" }}>SAIDA DE PELUCIA</div>
              <div className="Admin_PagamentosSearch_nbList">
                {estoque ?? "-"}
              </div>
              <div style={{ marginLeft: "1px" }}>RELOGIO CREDITO</div>
              <div className="Admin_PagamentosSearch_nbList1">
                {contadorcredito ?? "-"}
              </div>
              <div style={{ marginLeft: "1px" }}>RELOGIO PELUCIA</div>
              <div className="Admin_PagamentosSearch_nbList1">
                {estoque ?? "-"}
              </div>
            </div>

            {maquinaInfos.store_id && (
              <Link
                target="_blank"
                to={`//www.mercadopago.com.br/stores/detail?store_id=${maquinaInfos.store_id}`}
              >
                <img
                  className="Admin_PagamentosSearch_QR_Icon"
                  src={qr_code_icon}
                  alt="QR"
                />
              </Link>
            )}
          </div>
          <div className="Admin_PagamentosSearch_description">{`${maquinaInfos?.nome} - ${maquinaInfos?.descricao}`}</div>

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

export default AdminPagamentosSearch;
