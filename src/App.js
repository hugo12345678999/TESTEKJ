import "./App.css";
import PrivateRoute from "./routes/PrivateRoute";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import SignIn from "./components/Auth/SignIn/SignIn";
import NewSignIn from "./components/Auth/AdminSignIn/SignIn";
import PublicRoute from "./routes/PublicRoute";
import Main from "./components/Layout/Main/Main";
import * as links from "./utils/links";
import DashboardMaquinas from "./components/Main/Dashboard/DashboardMáquinas";
import ClientesDashboard from "./components/Main/Cliente/ClientesDashboard/ClientesDashboard";
import PagamentosSearch from "./components/Main/SearchPagamentos/PagamentosSearch";
import DeletePagamento from "./components/Main/SearchPagamentos/DeletePagamento";
import EditPagamento from "./components/Main/SearchPagamentos/EditPagamento";
import EditCliente from "./components/Main/Cliente/EditCliente/EditCliente";
import DeleteMaquina from "./components/Main/SearchPagamentos/DeleteMaquina";
import ClienteMaquinas from "./components/Main/Cliente/ClienteMaquinas/ClienteMaquinas";
import HelpPage from "./components/Main/HelpPage/HelpPage";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import AddMachine from "./components/Main/AddMachine/AddMachine";
import AddCliente from "./components/Main/Cliente/AddCliente/AddCliente";
import RemoteCredit from "./components/Main/RemoteCredit/RemoteCredit";
import DeleteCliente from "./components/Main/Cliente/DeleteCliente/DeleteCliente";
import Relatorio from "./components/Main/Relatorio/Relatorio/Relatorio";
import TokenHelpPage from "./components/Main/TokenHelpPage/TokenHelpPage";
import AdminPagamentosSearch from "./components/Main/Cliente/AdminSearchPagamentos/AdminPagamentosSearch";
import AdminEditPagamento from "./components/Main/Cliente/AdminSearchPagamentos/AdminEditPagamento";
import AdminDeletePagamento from "./components/Main/Cliente/AdminSearchPagamentos/AdminDeletePagamento";
import ConfigSignIn from "./components/Auth/Config/ConfigSignIn/ConfigSignIn";
import Trocar from "./components/Main/Cliente/Trocar/Trocar";
import AddMaquina from "./components/Main/Cliente/AddMaquina/AddMaquina";
import CreditoRemoto from "./components/Main/Cliente/CreditoRemoto/CreditoRemoto";
import RelatorioAdmin from "./components/Main/Cliente/RelatorioAdmin/RelatorioAdmin";
import AdminDeleteALLPagamentos from "./components/Main/Cliente/AdminSearchPagamentos/AdminDeleteALLPagamentos";

import EditGarraManualProbabilidadeCliente from "./components/Main/RemoteCredit/Edit-garra-manual-probabilidade-cliente";
import EditGarraManualGarraForteCliente from "./components/Main/RemoteCredit/Edit-garra-manual-garra-forte-cliente";
import EditGarraManualGarraMediaCliente from "./components/Main/RemoteCredit/Edit-garra-manual-garra-media-cliente";
import EditGarraManualGarraFracaCliente from "./components/Main/RemoteCredit/Edit-garra-manual-garra-fraca-cliente";
import EditGarraManualGarraPremioCliente from "./components/Main/RemoteCredit/Edit-garra-manual-garra-premio-cliente";

import EditProbabilidadeCliente from "./components/Main/RemoteCredit/Edit-probabilidade-cliente";
import EditprobabilidadeAdm from "./components/Main/Cliente/CreditoRemoto/Edit-probabilidade-adm";
import EditGarraForteCliente from "./components/Main/RemoteCredit/Edit-garra-forte-cliente";
import EditGarraPremioCliente from "./components/Main/RemoteCredit/Edit-garra-premio-cliente";
import EditGarraForteAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-forte-adm";
import EditGarraMediaCliente from "./components/Main/RemoteCredit/Edit-garra-media-cliente";
import Valorpulso from "./components/Main/RemoteCredit/valorpulso";
import EditGarraFracaCliente from "./components/Main/RemoteCredit/Edit-garra-fraca-cliente";
import EditGarraMediaAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-media-adm";
import EditGarraFracaAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-fraca-adm";
import EditGarraPremioAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-premio-adm";

import EditGarraManualProbabilidadeAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-manual-probabilidade-adm";
import EditGarraManualGarraForteAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-manual-garra-forte-adm";
import EditGarraManualGarraMediaAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-manual-garra-media-adm";
import EditGarraManualGarraFracaAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-manual-garra-fraca-adm";
import EditGarraManualGarraPremioAdm from "./components/Main/Cliente/CreditoRemoto/Edit-garra-manual-garra-premio-adm";

import GruaAdm from "./components/Main/Cliente/AdminSearchPagamentos/grua-adm";
import GruaManualAdm from "./components/Main/Cliente/AdminSearchPagamentos/admin-edit-garra-manual";
import GruaCliente from "./components/Main/SearchPagamentos/grua-cliente";
import AlterarGruaCliente from "./components/Main/SearchPagamentos/alterar-grua-cliente";
function App() {
  const {
    setDataUser,
    loading,
    notiMessage,
    setNotiMessage,
    notiMessageInfo,
    setNotiMessageInfo,
    authInfo,
  } = useContext(AuthContext);

  const type = authInfo?.dataUser?.type;

  useEffect(() => {
    if (notiMessage) {
      setNotiMessage(null);

      switch (notiMessage.type) {
        case "error":
          NotificationManager.error(notiMessage.message, "Hmm... ");
          break;
        case "success":
          NotificationManager.success(notiMessage.message, "... ");
          break;
        case "info":
          NotificationManager.info(notiMessage.message, "... ");
          break;
        case "warning":
          NotificationManager.warning(notiMessage.message, "... ");
          break;
      }
    }
  }, [notiMessage]);

  // useEffect(() => {
  //     if (notiMessageInfo) {
  //         setNotiMessageInfo(null)
  //         NotificationManager.info(notiMessageInfo, '... ');
  //     }
  // }, [notiMessageInfo])

  return (
    <>
      <NotificationContainer />
      <Routes>
        {
          <>
            <Route
              path={`${links.FORNECEDOR_SEARCH_CANAIS}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <PagamentosSearch />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AdminPagamentosSearch />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.GRUA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <GruaAdm />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.GRUA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <GruaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.ALTERAR_GRUA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AlterarGruaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <GruaManualAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            
            <Route
              path={`${links.VALOR_PULSO}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <Valorpulso />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.CREDITO_REMOTO_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <CreditoRemoto />
                  </Main>
                </PrivateRoute>
              }
            />

             <Route
              path={`${links.EDIT_PROBABILIDADE_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditprobabilidadeAdm />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_PROBABILIDADE_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditProbabilidadeCliente />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MANUAL_PROBABILIDADE_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualProbabilidadeCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_PROBABILIDADE_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualProbabilidadeAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_FORTE_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraForteCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_FORTE_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraForteAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_MEDIA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraMediaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_MEDIA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraMediaAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_FRACA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraFracaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_FRACA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraFracaAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_PREMIO_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraPremioCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MANUAL_GARRA_PREMIO_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraManualGarraPremioAdm />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_FORTE_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraForteCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_MEDIA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraMediaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_FORTE_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraForteAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_MEDIA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraMediaAdm />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_FRACA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraFracaAdm />
                  </Main>
                </PrivateRoute>
              }

            />
             <Route
              path={`${links.EDIT_GARRA_FRACA_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraFracaCliente />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_PREMIO_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraPremioAdm />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_GARRA_PREMIO_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditGarraPremioCliente />
                  </Main>
                </PrivateRoute>
              }

            />
            <Route
              path={`${links.EDIT_FORNECEDOR_CANAIS}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditPagamento />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.CLIENTES_MAQUINAS_EDIT_FORNECEDOR}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AdminEditPagamento />
                  </Main>
                </PrivateRoute>
              }
            />
            
            <Route
              path={`${links.CLIENTES_MAQUINAS_TROCAR}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <Trocar />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.ADD_CLIENTES_MAQUINA_ADM}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AddMaquina />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.EDITAR_CLIENTES}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <EditCliente />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.DELETE_FORNECEDOR_CANAIS}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <DeletePagamento />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.CLIENTES_MAQUINAS_DELETE_FORNECEDOR}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AdminDeletePagamento />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.CLIENTES_MAQUINA_DELETE_PAGAMENTOS}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <AdminDeleteALLPagamentos />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.DELETE_CLIENTE}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <DeleteCliente />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.RELATORIO}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <Relatorio />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.RELATORIO_ADMIN}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <RelatorioAdmin />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.CLIENTES_MAQUINAS}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <ClienteMaquinas />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.DELETE_FORNECEDOR}/:id`}
              element={
                <PrivateRoute>
                  <Main>
                    <DeleteMaquina />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.HELP_PAGE}`}
              element={
                <PrivateRoute>
                  <Main>
                    <HelpPage />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={`${links.TOKEN_HELP_PAGE}`}
              element={
                <PrivateRoute>
                  <Main>
                    <TokenHelpPage />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={links.DASHBOARD_FORNECEDOR}
              element={
                <PrivateRoute>
                  <Main>
                    <DashboardMaquinas></DashboardMaquinas>
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={links.DASHBOARD_CLIENTES}
              element={
                <PrivateRoute>
                  <Main>
                    <ClientesDashboard />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={links.ADD_MACHINE}
              element={
                <PrivateRoute>
                  <Main>
                    <AddMachine />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={links.ADD_CLIENTES}
              element={
                <PrivateRoute>
                  <Main>
                    <AddCliente />
                  </Main>
                </PrivateRoute>
              }
            />
            <Route
              path={links.REMOTE_CREDIT}
              element={
                <PrivateRoute>
                  <Main>
                    <RemoteCredit />
                  </Main>
                </PrivateRoute>
              }
            />
          </>
        }
        <Route
          path={links.SIGNIN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path={links.ADMIN_SIGNIN}
          element={
            <PublicRoute>
              <NewSignIn />
            </PublicRoute>
          }
        />
        <Route
          path={links.CONFIG}
          element={
            <PublicRoute>
              <ConfigSignIn />
            </PublicRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
