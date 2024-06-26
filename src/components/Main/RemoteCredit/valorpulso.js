import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input } from "antd";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import * as links from "../../../utils/links";
import { FORNECEDOR_SEARCH_CANAIS } from "../../../utils/links";

const ValorPulso = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const maquinaInfos = location.state;
    const { setDataUser, loading, authInfo, setNotiMessage } = useContext(AuthContext);
    let navigate = useNavigate();
    const token = authInfo?.dataUser?.token;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ valor: '' });
    const [errors, setErrors] = useState({});
    const [valorpulso, setvalorpulso] = useState(null); // Estado para armazenar o valor da garra forte
    const [matchMessage, setMatchMessage] = useState(""); // Mensagem de correspondência

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

    const fetchvalorpulso = () => {
        axios.get(`${process.env.REACT_APP_SERVIDOR}/valor-pulso/${id}`, {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            },
        })
        .then((res) => {
            setvalorpulso(res.data.valorpulso); // Atualize o estado com o valor da garra forte recebido
        })
        .catch((err) => {
            // Lide com os erros da requisição
        });
    };

    const onSave = () => {
        // check require
        let errorsTemp = {}
        if (data.valor.trim() === "") {
            errorsTemp.valor = 'Este campo é obrigatório'
        }
        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp)
            return;
        }
        let VALOR_BASE;
        if(data.valor < 10){
            VALOR_BASE = 100;
        }else{
            VALOR_BASE = 10;
        }
        setIsLoading(true)
        axios.post(`${process.env.REACT_APP_SERVIDOR}/credito-remoto-cliente`, {
            id: id,
            valor: VALOR_BASE+data.valor,
        }, {
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
            if (parseFloat(data.valor) === valorpulso) {
                setNotiMessage({
                    type: 'error',
                    message: 'O VALOR É IGUAL'
                });
            } else {
                setNotiMessage({
                    type: 'success',
                    message: `CONFIGURANDO`
                });
            }
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

    const checkMatch = () => {
        if (parseFloat(data.valor) === valorpulso) {
            setMatchMessage("O VALOR ÌGUAL!");
        } else {
            setMatchMessage("");
        }
    };

    useEffect(() => {
        fetchvalorpulso(); // Fetch da garra forte ao montar o componente
        const interval = setInterval(fetchvalorpulso, 10000); // Atualiza a cada 10 segundos
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [id]); // Execute sempre que o ID mudar

    useEffect(() => {
        checkMatch(); // Verifique a correspondência ao montar o componente
    }, [data.valor, valorpulso]); // Execute sempre hhhhue o valor do campo de entrada ou a garra forte mudar

    return (
        <>
            {isLoading && <LoadingAction />}
            <div className="AddMachine_container">
                <div className="AddMachine_header">
                    <div className="AddMachine_header_title">
                        VALOR PULSO {maquinaInfos.nome}
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

export default ValorPulso;
