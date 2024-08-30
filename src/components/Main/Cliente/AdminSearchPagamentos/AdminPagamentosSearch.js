import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminPagamentosSearch.css";
import { Button, Table } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
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
          console.log(res.data); // Verificar a estrutura dos dados recebidos
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

  const createPointPaymentIntent = () => {
    const url = 'https://api.mercadopago.com/point/integration-api/devices/GERTEC_MP35P__8701442347041298/payment-intents';
    const headers = {
      Authorization: 'Bearer APP_USR-1586240537053971-100817-e995d67c6a80ebacaaadbabd0bde449b-344946086',
      'Content-Type': 'application/json',
    };
    const body = {
      additional_info: {
        external_reference: '57640273',
        print_on_terminal: true
      },
      amount: 200,
      description: 'your payment intent description'
    };

    axios.post(url, body, { headers })
      .then(response => {
        console.log('Pagamento criado com sucesso:', response.data);
        setNotiMessage({
          type: 'success',
          message: 'Pagamento criado com sucesso.',
        });
      })
      .catch(error => {
        console.error('Erro ao criar pagamento:', error);
        setNotiMessage({
          type: 'error',
          message: 'Erro ao criar pagamento.',
        });
      });
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
    return numStr.padStart(length, '0');
  };

  const onRelatorioHandler = () => {
    if (!dataInicio && !dataFim) {
      setNotiMessage({
        type: "error",
        message:
          "Selecione no calendario a esquerda a data de inicio e data fim",
      });
      return;
    }
    if (dataInicio > dataFim) {
      setNotiMessage({
        type: "error",
        message: "A data final deve ser maior que a inicial",
      });
      return;
    }
    getPaymentsPeriod(dataInicio, dataFim);
  };

  const onDataInicioChange = (date, dateString) => {
    setDataInicio(dateString);
  };

  const onDataFimChange = (date, dateString) => {
    setDataFim(dateString);
  };

  const formatMoney = (value) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }
    return value;
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
            onClick={createPointPaymentIntent}
          >
            Pontos
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
        <div className="Admin_PagamentosSearch_body_top">
          <div className="Admin_PagamentosSearch_body_top_left">
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(dates) => {
                if (dates) {
                  setDataInicio(dates[0]?.format("YYYY-MM-DD"));
                  setDataFim(dates[1]?.format("YYYY-MM-DD"));
                }
              }}
            />
            <Button onClick={onRelatorioHandler}>
              <FontAwesomeIcon icon={faSearch} />
              <span>Buscar</span>
            </Button>
            <Button
              onClick={() => {
                setDataInicio(null);
                setDataFim(null);
                getData(id);
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} />
              <span>Limpar</span>
            </Button>
          </div>
        </div>
        <Table
          dataSource={listCanals}
          columns={columns}
          rowKey="id"
          loading={loadingTable}
          pagination={false}
        />
        <div className="Admin_PagamentosSearch_summary">
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estornos:</strong> {formatMoney(estornos)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Cash:</strong> {formatMoney(cash)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Probabilidade:</strong> {formatMoney(probabilidade)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estoque:</strong> {formatMoney(estoque)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Contador Crédito:</strong> {formatNumberWithLeadingZeros(contadorcredito, 6)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Contador Pelúcia:</strong> {formatNumberWithLeadingZeros(contadorpelucia, 6)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estoque 2:</strong> {formatMoney(estoque2)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estoque 3:</strong> {formatMoney(estoque3)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estoque 4:</strong> {formatMoney(estoque4)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Estoque 5:</strong> {formatMoney(estoque5)}
          </div>
          <div className="Admin_PagamentosSearch_summary_item">
            <strong>Total:</strong> {formatMoney(total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPagamentosSearch;
