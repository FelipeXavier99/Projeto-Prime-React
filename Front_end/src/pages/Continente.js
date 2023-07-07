import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from '../pages_css/Continente.module.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function getContinente() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const continente = urlParams.get('continente');
  return continente;
}

function Continente() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [nome, setNome] = useState('');
  const [editingTipoLance, setEditingTipoLance] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const continente = getContinente();
    axios.get(`http://localhost:3001/continente?continente=${continente}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [copa]);

  // mensagens botoes
  useEffect(() => {
    if (showSuccessMessage) {
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Ação realizada com sucesso!',
        life: 3000
      });

      // Resetar o estado showSuccessMessage após a exibição da mensagem
      setShowSuccessMessage(false);
    }
  }, [showSuccessMessage]);

  const handleSaveTipoLance = () => {
    let tipoLanceData = {};

    if (editingTipoLance) {
      tipoLanceData = { nome };
      axios.put(`http://localhost:3001/continente/${editingTipoLance.id_continente}`, tipoLanceData)
        .then((response) => {
          console.log("Continente atualizado com sucesso");
          setEditingTipoLance(null);
          setNome('');
          setShowDialog(false);
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      tipoLanceData = { nome };
      axios.post("http://localhost:3001/registerContinente", tipoLanceData)
        .then((response) => {
          console.log(response.data);
          setShowDialog(false);
          setNome('');
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
  };

  const handleEdit = (continente) => {
    setEditingTipoLance(continente);
    setNome(continente.nome);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setNome('');
  };

  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button label="Cancelar" onClick={handleCancel} className="p-button-secondary" />
    </div>
  );

  const deletarContinente = (tipoContinente) => {
    axios
      .delete(`http://localhost:3001/deleteContinente/${tipoContinente}`)
      .then((response) => {
        console.log("Continente excluído com sucesso");
        setCopas((prevCopas) => prevCopas.filter((tipoLance) => tipoLance.id_continente !== tipoContinente));

        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir Continente:", error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
      <h2>Tabela Continente</h2>

      <div>
        <Button label="Inserir Continente" onClick={handleClick} />
        <Dialog
          header={editingTipoLance ? "Editar Continente" : "Inserir Continente"}
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          <div className="formulario">
            <div className="p-field">
              <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o Continente" />
            </div>
          </div>
        </Dialog>
      </div>

      <DataTable value={copa}>
        <Column field="nome" header="CONTINENTE" />
        <Column header="AÇÕES" body={(rowData) => (
          <div className={styles.button_container}>
            <Button label="Editar" onClick={() => handleEdit(rowData)} className="p-button-success" />
            <Button label="Excluir" onClick={() => deletarContinente(rowData.id_continente)} className="p-button-danger" />
          </div>
        )} />
      </DataTable>

      <Toast ref={toast} />

    </section>
  );
}

export default Continente;
