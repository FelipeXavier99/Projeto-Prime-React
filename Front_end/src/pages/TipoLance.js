import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import styles from '../pages_css/TipoLance.module.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function getTipoLance() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tipoLance = urlParams.get('tipoLance');
  return tipoLance;
}

function TipoLance() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [nome, setNome] = useState('');
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
  

  useEffect(() => {
    const tipoLance = getTipoLance();
    axios.get(`http://localhost:3001/tipolance?tipoLance=${tipoLance}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [copa]);  // aqui atualiza a página

  const handleSaveTipoLance = () => {
    // condicao qdo aperta o salvar pra inserir e editar!
    if (editingTipoLance) {
      // Atualizar tipo de lance existente
      const tipoLanceData = { nome };
      axios.put(`http://localhost:3001/tipoLance/${editingTipoLance.id_tipo_lance}`, tipoLanceData)
        .then((response) => {
          console.log("Tipo Lance atualizado com sucesso");
          setEditingTipoLance(null);
          
          setNome('');
          setShowDialog(false);
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Criar novo tipo de lance
      const tipoLanceData = { nome };
      axios.post("http://localhost:3001/registerTipoLance", tipoLanceData)
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

  // variável Inserir
  const handleClick = () => {
    setEditingTipoLance(null);
    setShowDialog(true);
  };

    // variável Editar
  const handleEdit = (tipoLance) => {
    setEditingTipoLance(tipoLance);
    setNome(tipoLance.nome);
    setShowDialog(true);
  };

  // variável Cancelar
  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setNome('');
  };


  // Form padrao Prime React dos botoes salvar e cancelar
  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button label="Cancelar" onClick={handleCancel} className="p-button-secondary" />
    </div>
  );

  const deletarTipoLance = (tipoLanceId) => {
    axios
      .delete(`http://localhost:3001/deleteTipoLance/${tipoLanceId}`)
      .then((response) => {
        console.log("Tipo Lance excluído com sucesso");
        setCopas((prevCopas) => prevCopas.filter((tipoLance) => tipoLance.id_tipo_lance !== tipoLanceId));
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir tipo de lance:", error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
      <h2>Tabela Tipos de Lance</h2>
      <div>
        <Button label="Inserir Tipo Lance" onClick={handleClick} />
        <Dialog
          header={editingTipoLance ? "Editar Tipo Lance" : "Inserir Tipo Lance"} // condicao ternária= altera o cabeçalho da msg qdo aperta editar/excluir
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          <div className="formulario">
            <div className="p-field">
              <InputText id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite a Seleção" />
            </div>
          </div>
        </Dialog>
      </div>

      <table>
        <thead>
          <tr>
            <th className={styles.cor_cabecalho}>LANCES</th>
            <th2 className={styles.cor_cabecalho}>AÇÕES</th2>
          </tr>
        </thead>
        <tbody>
          {copa.map((tipoLance) => (
            <tr key={tipoLance.id_tipo_lance}>
              <td>{tipoLance.nome}</td>
              <td>
                <div className={styles.button_container}>
                  <Button label="Editar" onClick={() => handleEdit(tipoLance)} className="p-button-success" /> 
                  <Button label="Excluir" onClick={() => deletarTipoLance(tipoLance.id_tipo_lance)} className="p-button-danger" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toast ref={toast} /> 
    </section>
  );
}

export default TipoLance;
