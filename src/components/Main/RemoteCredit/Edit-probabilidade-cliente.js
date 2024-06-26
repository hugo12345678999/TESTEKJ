import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import * as links from "../../../utils/links";
import { Button, Input } from "antd";

const EditProbabilidadeCliente = (props) => {
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
    const [probabilidade, setProbabilidade] = useState(null); // Estado para armazenar o valor da probabilidade
    const [matchMessage, setMatchMessage] = useState(""); // Estado para armazenar a mensagem de correspondência

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

    const fetchProbabilidade = () => {
        axios.get(`${process.env.REACT_APP_SERVIDOR}/probabilidade/${id}`, {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            },
        })
        .then((res) => {
            setProbabilidade(res.data.probabilidade); // Atualize o estado com o valor da probabilidade recebido
        })
        .catch((err) => {
            // Lide com os erros da requisiçjjão
        });
    };

    const onSave = () => {
        // check require
        let errorsTemp = {}
        if (data.valor.trim() === "") {
            errorsTemp.valor = 'Este campo é obrigatório'
        }
        if(data.valor.trim() < 1){
            errorsTemp.valor = 'DIGITE UM VALOR MAIOR OU IGUAL A 1'
       
        }else{
            setNotiMessage({
                type: 'success',
                message: 'CONFIGURANDO PROBABILIDADE, AGUARDE 3 MINUTOS PARA  CONFIGURAR OUTRA FUNCAO!'
            })

        }
        if(data.valor.trim() > 97){
            errorsTemp.valor = 'DIGITE UM VALOR MENOR OU IGUAL A 97'
       
        }
        if(data.valor.trim() > 100){
            errorsTemp.valor = 'DIGITE UM VALOR MENOR OU IGUAL A 97'
       
        }
        if (parseFloat(data.valor) === probabilidade) {
            errorsTemp.valor = 'O VALOR É IGUAL!'
        }
        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp)
            return;
        }
        let VALOR_BASE;
        if(data.valor < 10){
            VALOR_BASE = 500;
        }else{
            VALOR_BASE = 50;
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
                if (parseFloat(data.valor) === probabilidade) {
                    setNotiMessage({
                        type: 'error',
                        message: 'O VALOR É IGUAL'
                    });
                } else {
                    setNotiMessage({
                        type: 'success',
                        message: `CONFIGURANDO PROBABILIDADE! AGUARDE O VALOR SER MODIFICADO PARA CONFIGURAR OUTRA FUNCAO!`
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
        if (parseFloat(data.valor) === probabilidade) {
            setMatchMessage("O VALOR ÌGUAL!");
        } else {
            setMatchMessage("");
        }
    };

    useEffect(() => {
        fetchProbabilidade(); // Fetch da probabilidade ao montar o componente
    }, [id]); // Execute sempre que o ID mudar

    useEffect(() => {
        checkMatch(); // Verifique a correspondência ao montar o componente
    }, [data.valor, probabilidade]); // Execute sempre que o valor do campo de entrada ou a probabilidade mudar

    useEffect(() => {
        const interval = setInterval(() => {
            fetchProbabilidade(); // Fetch da probabilidade a cada 10 segundos
        }, 10000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []);

    return (
        <>
            {isLoading && <LoadingAction />}
            <div className="AddMachine_container">
                <div className="AddMachine_header">
                    <div className="AddMachine_header_title">
                        PROBABILIDADE {maquinaInfos.nome}
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
                    {matchMessage && (
                        <div className="AddMachine_itemFieldMatch">{matchMessage}</div>
                    )}
                    <Button className="AddMachine_saveBtn" onClick={() => {
                        if (!isLoading) onSave()
                    }} disabled={isLoading}>
                        ENVIAR
                    </Button>
                     {/* Exibir o valor da garra forte com estilo aumentado */}
                     <div className="probabilidadeResult" style={{ fontSize: '24px' }}>
                     VALOR PROBABILIDADE: {probabilidade !== null ? probabilidade : "NULL..."}
                    </div>

                    {/* Exibir a mensagem de correspondência */}
                    {matchMessage && <div className="matchMessage">{matchMessage}</div>}
                </div>

            </div>
        </>
    )
}


export default EditProbabilidadeCliente;
