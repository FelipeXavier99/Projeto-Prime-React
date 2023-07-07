


import React, { useState, useEffect } from "react";
import Axios from "axios";
import styles from "../pages_css/EditIdioma.module.css";

export default function EditIdioma({ handleRegisterGame }) {
  const [values, setValues] = useState({
    ano: "",
    nomePais: ""
  });
  
  const [listCard, setListCard] = useState([]);
  /*
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
*/


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ano = searchParams.get("ano");
    const nomePais = searchParams.get("nomePais");
    setValues({ ano, nomePais });
  }, []);

  const registerGame = () => {
    const { ano} = values;
    console.log("Idioma:", ano);
    

    Axios.post("http://localhost:3001/registerIdioma", { ano }) 
      .then(() => {
        Axios.post("http://localhost:3001/searchIdioma", { ano })   
          .then((response) => {
            if (response.data && response.data[0] && response.data[0].id) {
              console.log("ID:", response.data[0].id);
              setListCard([
                ...listCard,
                {
                  id: response.data[0].id,
                  ano
               
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

  const handleSubmit = () => {
    registerGame();
  };
  

  return (

    /* TTABELA COM OS INPUTS */
    <div className={styles.appContainer}>
      <div className={styles.registerContainer}>
        <h1 className={styles.registerTitle}>Inserir Idioma</h1>
        <input
          type="text"
          name="ano"
          placeholder="Idioma"
          className="register-input"
          value={values.ano}
          onChange={handleAddValues}
          />
       
        

   
        <button onClick={handleSubmit} className="register-button">
          Cadastrar
  </button>  
      </div>
    </div>
  );
}
