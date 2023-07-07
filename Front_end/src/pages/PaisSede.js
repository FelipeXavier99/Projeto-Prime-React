import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import styles from '../pages_css/PaisSede.module.css';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



function TipoLance() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [Sede, setSede] = useState('');
  const [Copa, setCopa] = useState('');
  const [editingTipoLance, setEditingTipoLance] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toast = useRef(null);


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





  //aqui mostra os dados da tabela
  useEffect(() => {
    axios.get("http://localhost:3001/paisSede")
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSaveTipoLance = () => {
    if (editingTipoLance) {
      const tipoLanceData = { nome: Sede, ano: Copa };
      axios.put(`http://localhost:3001/paisSede/${editingTipoLance.idPaisSede}`, tipoLanceData)
        .then((response) => {
          console.log("Pais Sede atualizado com sucesso");
          setEditingTipoLance(null);
          setSede('');
          setCopa('');
          setShowDialog(false);
          updateCopasList();
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const tipoLanceData = { nome: Sede, ano: Copa };
      axios.post("http://localhost:3001/registerPais", tipoLanceData)
        .then((response) => {
          console.log(response.data);
          setShowDialog(false);
          setSede('');
          setCopa('');
          updateCopasList();
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const updateCopasList = () => {
    axios.get("http://localhost:3001/paisSede")
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = () => {
    setEditingTipoLance(null);
    setShowDialog(true);
  };

  const handleEdit = (tipoLance) => {
    setEditingTipoLance(tipoLance);
    setSede(tipoLance.Sede);
    setCopa(tipoLance.Copa);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setSede('');
    setCopa('');
  };

  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button label="Cancelar" onClick={handleCancel} className="p-button-secondary" />
    </div>
  );

  const deletarTipoLance = (tipoLanceId) => {
    axios
      .delete(`http://localhost:3001/deletePais/${tipoLanceId}`)
      .then((response) => {
        console.log("Pais Sede excluído com sucesso");
        updateCopasList();
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir tipo de lance:", error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
        <h2> Tabela Pais Sede</h2>
      
      <div>
        <Button label="Inserir Pais Sede" onClick={handleClick} />
        <Dialog
          header={editingTipoLance ? "Editar Pais Sede" : "Inserir Pais Sede"}
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          <div className="formulario">
            <div className="p-field">
              <InputText id="Copa" value={Copa} onChange={(e) => setCopa(e.target.value)} placeholder="Digite o Ano" />
            </div>
            <div className="p-field">
              <InputText id="Sede" value={Sede} onChange={(e) => setSede(e.target.value)} placeholder="Digite a Seleção" />
            </div>
          </div>
        </Dialog>
      </div>

      <DataTable value={copa}>
        <Column field="Copa" header="ANO COPA" />
        <Column field="Sede" header="PAÍS SEDE" />
        <Column header="AÇÕES" body={(rowData) => (
          <div>
            <Button label="Editar" onClick={() => handleEdit(rowData)} className="p-button-success" />
            <Button label="Excluir" onClick={() => deletarTipoLance(rowData.idPaisSede)} className="p-button-danger" />
          </div>
        )} />
      </DataTable>
      <Toast ref={toast} />
    </section>
  );
}

export default TipoLance;
