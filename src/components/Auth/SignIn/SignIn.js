import "./SignIn.css";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import Auth from "../Auth/Auth";
import * as links from "../../../utils/links";
import signin from "../../../assets/images/teste_azul1.png";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const initialDataSignIn = {
  email: "",
  password: "",
};

const initErrorField = {
  email: undefined,
  password: undefined,
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignIn = (props) => {
  const { setDataUser, loading, notiMessage, setNotiMessage } =
    useContext(AuthContext);
  let navigate = useNavigate();

  // useEffect(() => {
  //     if (notiMessage) {
  //         setNotiMessage(null)
  //         NotificationManager.error(notiMessage, 'Hmm... ');
  //     }
  // }, [])

  const [dataAuth, setDataSingUp] = useState({ ...initialDataSignIn });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorField, setErrorField] = useState({ ...initErrorField });
  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = () => {
    let dataErrorField = {};
    if (dataAuth.email.trim() === "") {
      dataErrorField = {
        ...dataErrorField,
        email: "Email obrigatório.",
      };
    } else if (!validateEmail(dataAuth.email.trim())) {
      dataErrorField = {
        ...dataErrorField,
        email: "Email inválido.",
      };
    }
    if (dataAuth.password.trim() === "") {
      dataErrorField = {
        ...dataErrorField,
        password: "Senha obrigatória",
      };
    } else if (dataAuth.password.trim().length < 6) {
      dataErrorField = {
        ...dataErrorField,
        password: "Senha tem que ter no mínimo 6 dígitos.",
      };
    }

    setSuccess(false);
    if (Object.keys(dataErrorField).length === 0) {
      setIsLoading(true);
      setError(null);
      axios
        .post(`${process.env.REACT_APP_SERVIDOR}/login-cliente`, {
          senha: dataAuth.password,
          email: dataAuth.email.trim(),
        })
        .then((res) => {
          if (res.status === 200) {
            // setNotiMessage({
            //     type: 'success',
            //     message: 'Credito inserido com sucesso!'
            // })
            setIsLoading(false);
            setSuccess(true);
            setDataSingUp({
              ...initialDataSignIn,
            });
            setDataUser({
              ...res.data,
            });
            navigate(links.DASHBOARD_FORNECEDOR);
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          setIsLoading(false);
          // setNotiMessage({
          //     type: 'error',
          //     message: 'Desculpe aconteceu algum problema, não foi possível inserir o crédito remotamente'
          // })
          if (err.response.status === 500) {
            setError(
              'Usuário já existe, <a target="_blank" href=' +
                links.FORGOTPASSWORD +
                ">esqueceu sua senha<a/>?"
            );
          } else {
            setError(
              "Erro, algo deu errado " + (err.response?.data?.error ?? "")
            );
          }
        });
    } else {
      setErrorField((prev) => {
        return {
          ...prev,
          ...dataErrorField,
        };
      });
    }
  };

  return (
    <>
      <NotificationContainer />
      {isLoading && <LoadingAction />}
      <Auth
        authTitle={"Login"}
        authDescription={"Preencha com e-mail e senha."}
        authFields={[
          {
            label: "E-mail",
            placeholder: "Digite seu e-mail",
            name: "email",
            value: dataAuth?.email ?? "",
            type: "text",
            setField: (value) => {
              setDataSingUp((prev) => ({
                ...prev,
                email: value,
              }));
              setErrorField((prev) => ({
                ...prev,
                email: undefined,
              }));
            },
            error: errorField?.email ?? "",
          },
          {
            label: "Senha",
            placeholder: "Digite sua senha",
            name: "password",
            value: dataAuth?.password ?? "",
            type: "password",
            setField: (value) => {
              setDataSingUp((prev) => ({
                ...prev,
                password: value,
              }));
              setErrorField((prev) => ({
                ...prev,
                password: undefined,
              }));
            },
            error: errorField?.password ?? "",
          },
        ]}
        authSubmit={"Entrar"}
        textImage={"PIX GRUA"}
        // authFooter={[
        //     {
        //         text1: 'Registre-se como um',
        //         text2: 'Canal de Vendas',
        //         link: links.SIGNUP_CANAL
        //     },
        //     {
        //         text1: 'Registrar-se como',
        //         text2: 'Fornecedor',
        //         link: links.SIGNUP_FORNECEDOR
        //     }
        // ]}
        authImage={signin}
        onsubmit={() => {
          onsubmit();
        }}
        successMessage={success ? "Usuário cadastrado com sucesso!" : ""}
        errorMessage={error ?? ""}
        // textImage={
        //     <div className="SignIn_textImage1">
        //         <div className="SignIn_textTitle">
        //             ALUGA MÁQ
        //         </div>
        //         {/* <div className="SignIn_textDescription">
        //             Facilitando o aluguel de máquinas
        //         </div> */}
        //     </div>
        // }
        isSignIn={true}
      />
    </>
  );
};

export default SignIn;
