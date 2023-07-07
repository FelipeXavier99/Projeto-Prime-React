import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../pages_css/Lance.module.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import Select from "react-select";

function Lance() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [tipodoLance, setTipoLance] = useState("");
  const [jogador1, setJogador1] = useState("");
  const [jogador2, setJogador2] = useState("");
  const [juiz, setJuiz] = useState("");
  const [editingTipoLance, setEditingTipoLance] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [juizList, setJuizList] = useState([]);
  const [disableJuizInput, setDisableJuizInput] = useState(false);
  const toast = useRef(null);


  //aqui mostra os juízes no inputt
  useEffect(() => {
    axios
      .get("http://localhost:3001/juizes")
      .then((response) => {
        setJuizList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  //aqui mostra a menssagem após apertar os botões!
  useEffect(() => {
    if (showSuccessMessage) {
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Ação realizada com sucesso!",
        life: 3000
      });

      setShowSuccessMessage(false);
    }
  }, [showSuccessMessage]);


  //aqui pega o id e mostra os dados na tabela
  useEffect(() => {
    const getTipoLance = () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const tipoLance = urlParams.get("tipoLance");
      return tipoLance;
    };

    const tipoLance = getTipoLance();
    axios
      .get(`http://localhost:3001/lance?tipoLance=${tipoLance}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [copa]);


  //condição pra Inserir e editar
  const handleSaveTipoLance = () => {
    if (editingTipoLance) {
      const tipoLanceData = {
        tipodoLance: tipodoLance,
        jogador1: jogador1,
        jogador2: jogador2,
        juiz: juiz.value // usar juiz.value em vez de juiz diretamente
      };

      axios
        .put(
          `http://localhost:3001/lance/${editingTipoLance.idLance}`,
          tipoLanceData
        )
        .then((response) => {
          console.log("Lance atualizado com sucesso");
          setEditingTipoLance(null);
          setTipoLance("");
          setJogador1("");
          setJogador2("");
          setJuiz("");
          setShowDialog(false);
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const tipoLanceData = {
        tipodoLance: tipodoLance,
        jogador1: jogador1,
        jogador2: jogador2,
        juiz: juiz.value // usar juiz.value em vez de juiz diretamente
      };

      axios
        .post("http://localhost:3001/registerLance", tipoLanceData)
        .then((response) => {
          console.log(response.data);
          setShowDialog(false);
          setTipoLance("");
          setJogador1("");
          setJogador2("");
          setJuiz("");
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleClick = () => {
    setEditingTipoLance(null);
    setShowDialog(true);
    setDisableJuizInput(false);
  };

  const handleEdit = (tipoLance) => {
    setEditingTipoLance(tipoLance);
    setTipoLance(tipoLance.TipoDoLance);
    setJogador1(tipoLance.Jogador1);
    setJogador2(tipoLance.Jogador2);
    setJuiz({ value: tipoLance.Juiz, label: tipoLance.Juiz });
    setShowDialog(true);
    setDisableJuizInput(true);
  };

  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setTipoLance("");
    setJogador1("");
    setJogador2("");
    setJuiz("");
  };

  //dialgo dos bostoes após apertar
  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button
        label="Cancelar"
        onClick={handleCancel}
        className="p-button-secondary"
      />
    </div>
  );

  const deletarTipoLance = (tipoLanceId) => {
    axios
      .delete(`http://localhost:3001/deleteLance/${tipoLanceId}`)
      .then((response) => {
        console.log("Lance excluído com sucesso");
        setCopas((prevCopas) =>
          prevCopas.filter((tipoLance) => tipoLance.idLance !== tipoLanceId)
        );
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir Lance:", error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
      <h2>Tabela Lance</h2>
      <div>
        <Button label="Inserir Lance" onClick={handleClick} />
        <Dialog
          header={editingTipoLance ? "Editar Lance" : "Inserir Lance"}
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          <div className="p-field">
            <Select
              id="Juiz"
              value={juiz}
              options={juizList.map((juiz) => ({
                value: juiz.nome,
                label: juiz.nome
              }))}
              onChange={(selectedOption) => setJuiz(selectedOption)}
              placeholder="Selecione o Juiz"
              isDisabled={disableJuizInput} // Desabilita o input de seleção de juiz
            />
          </div>

          <div className="formulario">
            <div className="p-field">
              <InputText
                id="TipoDoLance"
                value={tipodoLance}
                onChange={(e) => setTipoLance(e.target.value)}
                placeholder="Digite o Tipo de Lance"
              />
            </div>
            <div className="p-field">
              <InputText
                id="Jogador1"
                value={jogador1}
                onChange={(e) => setJogador1(e.target.value)}
                placeholder="Digite o Jogador1"
              />
            </div>
            <div className="p-field">
              <InputText
                id="Jogador2"
                value={jogador2}
                onChange={(e) => setJogador2(e.target.value)}
                placeholder="Digite o Jogador 2"
              />
            </div>
          </div>
        </Dialog>
      </div>

      <table>
        <thead>
          <tr>
            <th className={styles.cor_cabecalho}>LANCE</th>
            <th className={styles.cor_cabecalho}>Jogador 1</th>
            <th className={styles.cor_cabecalho}>Jogador 2</th>
            <th className={styles.cor_cabecalho}>Seleção 1</th>
            <th className={styles.cor_cabecalho}>Seleção 2</th>
            <th className={styles.cor_cabecalho}>Juiz</th>
            <th className={styles.cor_cabecalho}>Copa</th>
            <th className={styles.cor_cabecalho}>País Sede</th>
            <th2 className={styles.cor_cabecalho}>Editar</th2>
            <th2 className={styles.cor_cabecalho}>Excluir</th2>
          </tr>
        </thead>
        <tbody>
          {copa.map((tipoLance) => (
            <tr key={tipoLance.id_tipo_lance}>
              <td>{tipoLance.TipoDoLance}</td>
              <td>{tipoLance.Jogador1}</td>
              <td>{tipoLance.Jogador2}</td>
              <td>{tipoLance.Selecao1}</td>
              <td>{tipoLance.Selecao2}</td>
              <td>{tipoLance.Juiz}</td>
              <td>{tipoLance.Copa}</td>
              <td>{tipoLance.PaisSede}</td>
              <td>
                <Button
                  icon="pi pi-pencil"
                  onClick={() => handleEdit(tipoLance)}
                  className="p-button-rounded p-button-warning"
                />
              </td>
              <td2>
                <Button
                  icon="pi pi-trash"
                  onClick={() => deletarTipoLance(tipoLance.idLance)}
                  className="p-button-rounded p-button-danger"
                />
              </td2>
            </tr>
          ))}
        </tbody>
      </table>
      <Toast ref={toast} />
    </section>
  );
}

export default Lance;
