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
  const [cash, setCash] = useState("");
  const [total, setTotal] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
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

  const createPaymentPoint = () => {
    const url = '/pagamento-point'; // URL da sua API
    const headers = {
      Authorization: `Bearer APP_USR-1586240537053971-100817-e995d67c6a80ebacaaadbabd0bde449b-344946086`,
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
        console.log('Pagamento Point criado com sucesso:', response.data);
        setNotiMessage({
          type: 'success',
          message: 'Pagamento Point criado com sucesso.',
        });
      })
      .catch(error => {
        console.error('Erro ao criar pagamento Point:', error);
        setNotiMessage({
          type: 'error',
          message: 'Erro ao criar pagamento Point.',
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
      render: (estornado) => (
        <span>{estornado ? "Sim" : "Não"}</span>
      ),
    },
    {
      title: "Ações",
      key: "acoes",
      width: 150,
      render: (_, record) => (
        <div className="Admin_PagamentosSearch_header_actionBtns">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Ver QR Code</Tooltip>}
          >
            <Button
              className="Admin_PagamentosSearch_header_actionBtn"
              onClick={() =>
                window.open(`http://localhost:5000/qrcode/${record.id}`)
              }
            >
              <img src={qr_code_icon} alt="QR Code" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Estornar Pagamento</Tooltip>}
          >
            <Button
              className="Admin_PagamentosSearch_header_actionBtn"
              onClick={() => handleEstorno(record.id)}
            >
              <AiFillDelete />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Editar</Tooltip>}
          >
            <Button
              className="Admin_PagamentosSearch_header_actionBtn"
              onClick={() => handleEdit(record.id)}
            >
              <AiOutlineEdit />
            </Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  const handleEstorno = (id) => {
    // Implementar função para estorno
  };

  const handleEdit = (id) => {
    // Implementar função para edição
  };

  return (
    <div className="Admin_PagamentosSearch">
      <div className="Admin_PagamentosSearch_header">
        <Button
          className="Admin_PagamentosSearch_header_editBtn"
          onClick={() => createPaymentPoint()}
        >
          Criar Pagamento Point
        </Button>
        <Button
          className="Admin_PagamentosSearch_header_editBtn"
          onClick={() => getData(id)}
        >
          Atualizar
        </Button>
        <div className="Admin_PagamentosSearch_header_datePicker">
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => {
              if (dates) {
                setDataInicio(dates[0].format("YYYY-MM-DD"));
                setDataFim(dates[1].format("YYYY-MM-DD"));
              }
            }}
          />
        </div>
      </div>
      {loadingTable ? (
        <LoadingAction />
      ) : (
        <Table
          columns={columns}
          dataSource={listCanals}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1300 }}
        />
      )}
    </div>
  );
};

export default AdminPagamentosSearch;
