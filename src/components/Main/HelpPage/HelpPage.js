import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./HelpPage.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../utils/links";
import HelpPage1 from "../../../assets/images/HelpPage1.png";
import HelpPage2 from "../../../assets/images/HelpPage2.png";
import HelpPage3 from "../../../assets/images/HelpPage3.png";
import question_black from "../../../assets/images/question_black.png";

const HelpPage = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const locationDate = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);

  const { id } = useParams();

  return (
    <div className="PagamentosSearch_container">
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">
            <img src={question_black} alt="question" />
          </div>
        </div>

        <Button
          className="Help_Page_header_back"
          onClick={() => {
            navigate(`${locationDate.redirect_url}`, { state: location.state });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>
      <div className="Help_Page_main">
        <p className="Help_Page_Title">
          Acesse o site do{" "}
          <a
            className="Help_Page_Href"
            target="__blank"
            href="//www.mercadopago.com.br/stores"
          >
            Mercado Pago
          </a>
          , depois, seu negócio lojas e caixas
        </p>
        <div className="Help_Page_Point">
          <p className="Help_Page_Point_Title">1- Lojas e caixas</p>
          <div className="Help_Page_Image">
            <img
              className="Help_Page_Point_Image"
              src={HelpPage1}
              alt="Lojas e caixas"
            />
          </div>
        </div>
        <div className="Help_Page_Point">
          <p className="Help_Page_Point_Title">
            2 - Clique na loja ou crie uma nova
          </p>
          <div className="Help_Page_Image">
            <img
              className="Help_Page_Point_Image"
              src={HelpPage2}
              alt="Clique na loja ou crie uma nova"
            />
          </div>
        </div>
        <div className="Help_Page_Point">
          <p className="Help_Page_Point_Title">
            3 - Obtenha o store_id= na url que vai aparecer:
          </p>
          <div className="Help_Page_Image">
            <img
              className="Help_Page_Point_Image"
              src={HelpPage3}
              alt="Obtenha o store_id= na url que vai aparecer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
