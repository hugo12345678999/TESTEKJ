import React, { useContext, useEffect, useState } from "react";
import "./ClientesDashboard.css";
import { Button, Col, Row } from "antd";
import axios from "axios";
import * as links from "../../../../utils/links";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { format , parseISO} from "date-fns";

const ClientesDashboard = (props) => {
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { dataUser } = authInfo;
  let navigate = useNavigate();

  const token = authInfo?.dataUser?.token;

  const [totalClientes, setTotalClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataData();

    const intervalId = setInterval(() => {
      dataData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const dataData = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/clientes`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setTotalClientes(res.data);
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

  const handleClienteClick = ({
    id,
    nome,
    email,
    ativo,
    dataInclusao,
    dataVencimento,
    ultimoAcesso,
    mercadoPagoToken,
  }) => {
    const cliente = {
      id,
      nome,
      email,
      ativo,
      dataInclusao,
      dataVencimento,
      ultimoAcesso,
      mercadoPagoToken,
    };
    navigate(`${links.CLIENTES_MAQUINAS}/${id}`, {
      state: cliente,
    });
  };

  return (
    <div>
      {isLoading && <LoadingAction />}
      <div className="Cliente_WarningMsgSpan">
        <span>{dataUser.warningMsg}</span>
      </div>
      <div className="Cliente_Dashboard_header">
        <div className="Cliente_Dashboard_staBlockTitle">Clientes</div>
      </div>
      <div className="Cliente_Dashboard_action">
        <Button style={{ margin: "0 15px" }} onClick={dataData}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            style={{ marginRight: "5px" }}
          />
          Atualizar
        </Button>
        <Link to={links.ADD_CLIENTES}>
          <Button className="Cliente_Dashboard_addbtn">
            <AiOutlinePlusCircle />
            <span>Criar novo cliente</span>
          </Button>
        </Link>
      </div>

      <Row>
        {totalClientes.map((post) => {
          let dataVencimentoVal = 0;
          const dt = new Date(post.dataVencimento);
          const dtDateOnly = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
          if (post.dataVencimento) {
            let dataVencimentoDate = new Date(post.dataVencimento);
            dataVencimentoVal = dataVencimentoDate.getTime() ?? 0;
          }

          const diferencaEmMilissegundos =
            new Date().getTime() - dataVencimentoVal;
          const diferencaEmDias = Math.floor(
            diferencaEmMilissegundos / (1000 * 60 * 60 * 24)
          );

          return (
            <Col
              xs={24}
              md={20}
              lg={20}
              xl={20}
              className="Cliente_Dashboard_col"
            >
              <div
                className="Cliente"
                key={post.id}
                onClick={() =>
                  handleClienteClick({
                    id: post.id,
                    nome: post.nome,
                    email: post.email,
                    ativo: post.ativo,
                    dataInclusao: post.dataInclusao,
                    dataVencimento: post.dataVencimento,
                    ultimoAcesso: post.ultimoAcesso,
                    mercadoPagoToken: post?.mercadoPagoToken,
                  })
                }
              >
                <div className="Cliente-info">
                  <div>
                    <h3>{post.nome}</h3>
                    <div className="Cliente-email">{post.email}</div>
                    <div className="Cliente-maquina">
                      Total de máquinas: {post.Maquina?.length}
                    </div>
                  </div>
                  <div className="Cliente-type-info">
                    <div className="Cliente-type-title">
                      <div>Situação:</div>
                      <div>Vencimento:</div>
                    </div>
                    <div>
                      <div
                        className="Cliente-type-val"
                        style={{
                          color: diferencaEmDias > 10 ? "red" : "#1223BB",
                        }}
                      >
                        {diferencaEmDias > 10 ? `INADIMPLENTE` : `REGULAR`}
                      </div>
                      <div>
                        {/* {format(new Date(post.dataVencimento), "dd/MM/yyyy")} */}
                        {format(dtDateOnly, 'dd/MM/yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="Cliente-footer">
                  <div>
                    Data de Inclusão:{" "}
                    {format(new Date(post.dataInclusao), "dd/MM/yyyy - kk:mm")}
                  </div>
                  <div>
                    Último Acesso:{" "}
                    {post.ultimoAcesso
                      ? format(
                          new Date(post.ultimoAcesso),
                          "dd/MM/yyyy - kk:mm"
                        )
                      : "--"}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ClientesDashboard;
