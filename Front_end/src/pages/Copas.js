import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../pages_css/Copas.module.css';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';

function getIdCopa() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const idCopa = urlParams.get('idCopa');
  return idCopa;
}

function Copas() {
  
  const [copa, setCopas] = useState([]);


 
  useEffect(() => {
    const idCopa = getIdCopa();
    axios.get(`http://localhost:3001/copa?idCopa=${idCopa}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deletarCopa = (ano) => {
    axios
      .delete(`http://localhost:3001/delete/${ano}`)
      .then((response) => {
        console.log("Copa excluída com sucesso");
        // Atualize o estado da lista de copas após a exclusão
        setCopas((prevCopas) => prevCopas.filter((c) => c.ano !== ano));
      })
      .catch((error) => {
        console.log("Erro ao excluir copa:", error);
      });
  };

  return (
    <section className={styles.copa_container}>
      <h2>Tabela Copas</h2>

      <Button
        component={Link}
        to="/EditCopas"
        className={`${styles.inserir_movedown}`}
        variant="contained"
        color="primary"
      >
        INSERIR COPAS
      </Button>

      <table>
        <thead>
          <tr>
            <th className={styles.cor_cabecalho}>Ano</th>
            <th className={styles.cor_cabecalho}>Sede</th>
            <th className={styles.cor_cabecalho}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {copa.map((c) => (
            <tr key={c.id}>
              <td>{c.ano}</td>
              <td>{c.nome}</td>
              <td>
                <div className={styles.button_container}>
                  <button className={styles.edit_button}>
                    <Link to={`/EditCopas?ano=${c.ano}&nomePais=${c.nome}`}>
                      Editar
                    </Link>
                  </button>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <button
                      className={styles.delete_button}
                      onClick={() => deletarCopa(c.ano)}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Copas;
