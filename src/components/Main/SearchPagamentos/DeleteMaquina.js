import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./DeletePagamento.css"
import { Button, Input, } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import * as links from "../../../utils/links";
import question_icon from "../../../assets/images/question.png";
import axios from "axios";


const DeleteMaquina = (props) => {
    const location = useLocation();
    let navigate = useNavigate();

    const {
        setDataUser,
        authInfo,
        setNotiMessage
    } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const token = authInfo?.dataUser?.token;

    const { id } = useParams();

    const deleteHandler = () => {

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
            data: { id }
        };


        axios.request(config)
            .then(res => {
                setNotiMessage({
                    type: 'success',
                    message: 'Deleted Successfully.'
                })
                navigate(links.DASHBOARD_FORNECEDOR)
            })
            .catch(err => {

                if ([401, 403].includes(err.response.status)) {
                    setNotiMessage({
                        type: 'error',
                        message: 'Delete Failed'
                    })
                    setDataUser(null);
                }
            })
    }

    return (
        <div className="PagamentosSearch_container">
            {isLoading && <LoadingAction />}
            <div className="Update_Pagamento_Content">
                <img className="Update_Pagamento_Icon" src={question_icon} alt="question icon" />
                <p className="Update_Pagamento_Text">Deseja excluir essa máquina?</p>
                <div className="Update_Pagamento_Btns">
                    <Button className="Update_Pagamento_Cancel_Btn" onClick={() => {
                        navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, { state: location.state })
                    }}>

                        <span>NÃO</span>
                    </Button>  <Button className="Update_Pagamento_Delete_Btn" onClick={() => {
                        deleteHandler()
                    }}>

                        <span>SIM, EXCLUA</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DeleteMaquina;
