import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import * as links from "../../../utils/links";
import { FORNECEDOR_SEARCH_CANAIS } from "../../../utils/links";
import { Button, Input } from "antd";

const EditGarraManualGarraFracaCliente = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const maquinaInfos = location.state;
    const {
        setDataUser,
        loading,
        authInfo,
        setNotiMessage
    } = useContext(AuthContext);
    let navigate = useNavigate();
    const token = authInfo?.dataUser?.token;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        valor: ''
    })
    const [errors, setErrors] = useState({})
    const handleChange = (name, value) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => {
            let errorsTemp = { ...prev }
            delete errorsTemp[name]
            return errorsTemp
        })
    }
    const onSave = () => {
        // check require
        let errorsTemp = {}
        if (data.valor === "") {
            errorsTemp.valor = "Este campo é obrigatório";
          }
          if(data.valor.trim() < 1){
            errorsTemp.valor = 'DIGITE UM VALOR MAIOR OU IGUAL A 1'
       
        }else{
            setNotiMessage({
                type: 'success',
                message: 'ALTERANDO O VALOR'
            })
      
        }
        if(data.valor.trim() > 40){
            errorsTemp.valor = 'DIGITE UM VALOR MENOR OU IGUAL A 40'
       
        }
        let VALOR_BASE;
        if (data.valor < 10) {
          VALOR_BASE = 850;
        } else {
          VALOR_BASE = 85;
        }
        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp)
            return;
        }

        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_SERVIDOR}/credito-remoto-cliente`, 
        {  id, valor: VALOR_BASE + data.valor},
         {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            }
        })
            .then(res => {
                setIsLoading(false)
                setData({
                    valor: ''
                })
                setNotiMessage({
                    type: 'success',
                    message: `${res?.data?.retorno}`
                })
            })
            .catch(err => {
                setIsLoading(false)
                if ([401, 403].includes(err.response.status)) {
                    // setNotiMessage('A sua sessão expirou, para continuar faça login novamente.');
                    setNotiMessage({
                        type: 'error',
                        message: 'A sua sessão expirou, para continuar faça login novamente.'
                    })
                    setDataUser(null);
                } else {
                    setNotiMessage({
                        type: 'error',
                        // message: 'Erro, algo deu errado ' + (err.response?.data?.msg ?? "")
                        message: `Erro, algo deu errado ${err.response?.data?.msg}`
                    })
                }
            })
    }
    return (
        <>
            {isLoading && <LoadingAction />}
            <div className="AddMachine_container">
                <div className="AddMachine_header">
                    <div className="AddMachine_header_title">
                    ALTERAR GARRA FRACA {maquinaInfos.nome}
                    </div>
                    <div className="AddMachine_header_back" onClick={() => {
                        navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, { state: location.state });
                    }}>
                        VOLTAR
                    </div>
                </div>
                <div className="AddMachine_content">
                    <div className="AddMachine_itemField">
                        <label
                            className="AddMachine_itemFieldLabel"
                            htmlFor="valor"
                        >
                            Valor:
                        </label>
                        <Input
                            placeholder={""}
                            value={data.valor}
                            id="valor"
                            type="number"
                            name="valor"
                            autoComplete="valor"
                            onChange={(event) => {
                                handleChange('valor', event.target.value)
                            }}
                            className={`${!!errors.valor ? 'AddMachine_inputError' : ''}`}
                        />
                        {errors.valor && (
                            <div className="AddMachine_itemFieldError">{errors.valor}</div>
                        )}
                    </div>
                    <Button className="AddMachine_saveBtn" onClick={() => {
                        if (!isLoading) onSave()
                    }} disabled={isLoading}>
                        ENVIAR
                    </Button>
                </div>

            </div>
        </>
    )
}

export default EditGarraManualGarraFracaCliente
