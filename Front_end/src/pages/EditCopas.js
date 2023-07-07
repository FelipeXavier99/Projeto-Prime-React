

/*  editcopas 2  atualizado 10:00*/

import React, { useState, useEffect } from "react";
import Axios from "axios";
import styles from "../pages_css/EditCopas.module.css";

export default function EditCopas({ handleRegisterGame }) {
  const [values, setValues] = useState({
    ano: "",
    nomePais: ""
  });
  const [listCard, setListCard] = useState([]);
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/paises")
      .then((response) => {
        setPaises(response.data);
      })
      .catch((error) => {
        console.log("Erro ao obter a lista de países:", error);
      });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ano = searchParams.get("ano");
    const nomePais = searchParams.get("nomePais");
    setValues({ ano, nomePais });
  }, []);

  const registerGame = () => {
    const { ano, nomePais } = values;
    console.log("Ano:", ano);
    console.log("Nome do País:", nomePais);

    Axios.post("http://localhost:3001/register", { ano, nomePais }) /* Insere no banco no banco */
      .then(() => {
        Axios.post("http://localhost:3001/search", { ano, nomePais })  /* confirma se tem no banco */
          .then((response) => {
            if (response.data && response.data[0] && response.data[0].id) {
              console.log("ID:", response.data[0].id);
              setListCard([
                ...listCard,
                {
                  id: response.data[0].id,
                  ano,
                  nomePais
                }
              ]);
            } else {
              console.log("ID não encontrado na resposta");
            }
          })
          .catch((error) => {
            console.log("Erro ao pesquisar:", error);
          });
      })
      .catch((error) => {
        console.log("Erro ao registrar:", error);
      });
  };

  const handleAddValues = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  //fazer aqui a condiçao pra inserir ou editar
  const handleSubmit = () => {
    registerGame();
  };

  return (

    /* TTABELA COM OS INPUTS */
    <div className={styles.appContainer}>
      <div className={styles.registerContainer}>
        <h1 className={styles.registerTitle}>Inserir Copas</h1>
        <input
          type="text"
          name="ano"
          placeholder="Ano"
          className="register-input"
          value={values.ano}
          onChange={handleAddValues}
        />

        <select
          className="register-input"
          name="nomePais"
          value={values.nomePais}
          onChange={handleAddValues}
        >
          <option value="">Selecione um país</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.nome}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit} className="register-button">
          Cadastrar
        </button>
      </div>
    </div>
  );
}
