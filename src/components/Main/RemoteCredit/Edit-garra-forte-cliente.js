import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input } from "antd";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import * as links from "../../../utils/links";
import { FORNECEDOR_SEARCH_CANAIS } from "../../../utils/links";

const EditGarraForteCliente = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const maquinaInfos = location.state;
    const { setDataUser, loading, authInfo, setNotiMessage } = useContext(AuthContext);
    let navigate = useNavigate();
    const token = authInfo?.dataUser?.token;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ valor: '' });
    const [errors, setErrors] = useState({});
    const [garraforte, setGarraforte] = useState(null); // Estado para armazenar o valor da garra forte
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

    const fetchGarraforte = () => {
        axios.get(`${process.env.REACT_APP_SERVIDOR}/garra-forte/${id}`, {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            },
        })
        .then((res) => {
            setGarraforte(res.data.garraforte); // Atualize o estado com o valor da garra forte recebido
        })
        .catch((err) => {
            // Lide com os erros da requisjição
        });
    };

    const onSave = () => {
        // check require
        let errorsTemp = {}
        if (data.valor.trim() === "") {
            errorsTemp.valor = 'Este campo é obrigatório'
        }
        if(data.valor.trim() < 13){
            errorsTemp.valor = 'DIGITE UM VALOR MAIOR OU IGUAL A  13'
       
        }else{
            setNotiMessage({
                type: 'success',
                message: 'CONFIGURANDO GARRA FORTE, AGUARDE 3 MINUTOS PARA CONFIGURAR OUTRA FUNCAO!'
            })

        }
        if(data.valor.trim() > 47){
            errorsTemp.valor = 'DIGITE UM VALOR MENOR OU IGUAL A 47'
       
        }
        if (parseFloat(data.valor) === garraforte) {
            errorsTemp.valor = 'O VALOR É IGUAL!'
        }
        if (Object.keys(errorsTemp).length > 0) {
            setErrors(errorsTemp)
            return;
        }
        let VALOR_BASE;
        if(data.valor < 10){
            VALOR_BASE = 600;
        }else{
            VALOR_BASE = 60;
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
       
      
        if (parseFloat(data.valor) === garraforte) {
            setMatchMessage("O VALOR É IGUAL!");
          
       
        } else {

            setMatchMessage("");
    };
    }
    useEffect(() => {
        fetchGarraforte(); // Fetch da garra forte ao montar o componente
        const interval = setInterval(fetchGarraforte, 10000); // Atualiza a cada 10 segundos
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, [id]); // Execute sempre que o ID mudar

    useEffect(() => {
        checkMatch(); // Verifique a correspondência ao montar o componente
    }, [data.valor, garraforte]); // Execute sempre que o valor do campo de entrada ou a garra forte mudar

    return (
        <>
            {isLoading && <LoadingAction />}
            <div className="AddMachine_container">
                <div className="AddMachine_header">
                    <div className="AddMachine_header_title">
                        GARRA FORTE {maquinaInfos.nome}
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
                    
                    {/* Exibir o valor da garra forte com estilo aumentado */}
                    <div className="garraforteResult" style={{ fontSize: '24px' }}>
                       VALOR GARRA FORTE: {garraforte !== null ? garraforte : "NULL..."}
                    </div>

                    {/* Exibir a mensagem de correspondência */}
                    {matchMessage && <div className="matchMessage">{matchMessage}</div>}
                </div>

            </div>
        </>
    )
}

export default EditGarraForteCliente;
