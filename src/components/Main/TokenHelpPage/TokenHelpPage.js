import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./TokenHelpPage.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../utils/links";
import TokenHelpPage1 from "../../../assets/images/TokenHelpPage1.png";
import TokenHelpPage2 from "../../../assets/images/TokenHelpPage2.png";
import TokenHelpPage3 from "../../../assets/images/TokenHelpPage3.png";
import TokenHelpPage4 from "../../../assets/images/TokenHelpPage4.png";
import TokenHelpPage5 from "../../../assets/images/TokenHelpPage5.png";
import question_black from "../../../assets/images/question_black.png";

const TokenHelpPage = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const locationDate = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);

  const { id } = useParams();

  return (
    <div className="PagamentosSearch_container">
      <div className="Token_Help_Page_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">
            <img src={question_black} alt="question" />
          </div>
        </div>

        <Button
          className="Token_Help_Page_header_back"
          onClick={() => {
            navigate(`${locationDate.redirect_url}`, { state: location.state });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>
      <div className="Token_Help_Page_main">
        <p className="Token_Help_Page_Title">
          Acesse o site do{" "}
          <a
            className="Token_Help_Page_Href"
            target="__blank"
            href="//www.mercadopago.com.br/developers"
          >
            Mercado Pago Developers
          </a>
        </p>
        <div className="Token_Help_Page_Point">
          <p className="Token_Help_Page_Point_Title">1- Suas integrações</p>
          <div className="Token_Help_Page_Image">
            <img
              className="Token_Help_Page_Point_Image"
              src={TokenHelpPage1}
              alt="Lojas e caixas"
            />
          </div>
        </div>
        <div className="Token_Help_Page_Point">
          <p className="Token_Help_Page_Point_Title">
            2 - Clique na loja ou crie uma nova
          </p>
          <div className="Token_Help_Page_Image">
            <img
              className="Token_Help_Page_Point_Image"
              src={TokenHelpPage2}
              alt="Clique na loja ou crie uma nova"
            />
          </div>
        </div>
        <div className="Token_Help_Page_Point">
          <p className="Token_Help_Page_Point_Title">
            3 - Valide que esta é a sua conta{" "}
          </p>
          <div className="Token_Help_Page_Image">
            <img
              className="Token_Help_Page_Point_Image"
              src={TokenHelpPage3}
              alt="Obtenha o store_id= na url que vai aparecer"
            />
          </div>
        </div>
        <div className="Token_Help_Page_Point">
          <p className="Token_Help_Page_Point_Title">
            4 - Credenciais de produção{" "}
          </p>
          <div className="Token_Help_Page_Image">
            <img
              className="Token_Help_Page_Point_Image"
              src={TokenHelpPage4}
              alt="Clique na loja ou crie uma nova"
            />
          </div>
        </div>
        <div className="Token_Help_Page_Point">
          <p className="Token_Help_Page_Point_Title">5 - Access Token</p>
          <div className="Token_Help_Page_Image">
            <img
              className="Token_Help_Page_Point_Image"
              src={TokenHelpPage5}
              alt="Obtenha o store_id= na url que vai aparecer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenHelpPage;
