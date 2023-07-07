// tec 2 completo


import React, { useState, useEffect,useRef} from "react";
import axios from "axios";
import styles from '../pages_css/Tecnico.module.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function getTecnico() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tecnico = urlParams.get('tecnico');
  return tecnico;
}

function Tecnico() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [nome, setNome] = useState('');
  const [anoNascimento, setAnoNascimento] = useState('');
  const [editingTipoLance, setEditingTipoLance] = useState(null);
  const [filtro, setFiltro] = useState('');
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


  // aqui mostra os dados da tabela
  useEffect(() => {
    const tecnico = getTecnico();
    axios.get(`http://localhost:3001/tecnico?tecnico=${tecnico}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [copa]);

  // condicao qdo aperta o salvar pra inserir e editar!
  const handleSaveTipoLance = () => {
    if (editingTipoLance) {
      // Atualizar tipo de lance existente
      const tipoLanceData = { nome, ano_nascimento: anoNascimento };
      axios.put(`http://localhost:3001/tecnico/${editingTipoLance.id_tecnico}`, tipoLanceData)
        .then((response) => {
          console.log("tecnico atualizado com sucesso");
          setEditingTipoLance(null);
          setNome('');
          setAnoNascimento('');
          setShowDialog(false);
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Criar novo tipo de Coninente
      const tipoLanceData = { nome, ano_nascimento: anoNascimento };
      axios.post("http://localhost:3001/registerTecnico", tipoLanceData)
        .then((response) => {
          console.log(response.data);
          setShowDialog(false);
          setNome('');
          setAnoNascimento('');
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
  const handleEdit = (tecnico) => {
    setEditingTipoLance(tecnico);
    setNome(tecnico.nome);
    setAnoNascimento(tecnico.ano_nascimento);
    setShowDialog(true);
  };

  // variável Cancelar
  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setNome('');
    setAnoNascimento('');
  };

  // Form padrao Prime React dos botoes salvar e cancelar
  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button label="Cancelar" onClick={handleCancel} className="p-button-secondary" />
    </div>
  );

  const deletarTecnico = (tipo) => {
    axios
      .delete(`http://localhost:3001/deleteTecnico/${tipo}`)
      .then((response) => {
        console.log("Tecnico excluído com sucesso");
        setCopas((prevCopas) => prevCopas.filter((tipoLance) => tipoLance.id_tecnico !== tipo));
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir Tecnico:", error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
      <h2>Tabela Técnico</h2> 

      {/* Botão de inserir */}
      <div>
        <Button label="Inserir Técnico" onClick={handleClick} />
        <InputText
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar"
        />
        <Dialog
          header={editingTipoLance ? "Editar Técnico" : "Inserir Técnico"} // condicao ternária= altera o cabeçalho da msg qdo aperta editar/excluir
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          {/* formulário do Editar e Inserir */}
          <div className="formulario">
            <div className="p-field">
              <InputText
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o Tecnico"
              />
            </div>
            <div className="p-field">
              <InputText
                id="anoNascimento"
                value={anoNascimento}
                onChange={(e) => setAnoNascimento(e.target.value)}
                placeholder="Digite o Ano de Nascimento"
              />
            </div>
          </div>
        </Dialog>
      </div>

      {/* Tabela prime react */}
      <DataTable
        value={copa.filter((item) =>
          item.nome.toLowerCase().includes(filtro.toLowerCase())
        )}
      >
        <Column field="nome" header="NOME" />
        <Column field="ano_nascimento" header="Data Nascimento" />
        <Column
          header="AÇÕES"
          body={(rowData) => (
            <div className={styles.button_container}>
              <Button
                label="Editar"
                onClick={() => handleEdit(rowData)}
                className="p-button-success"
              />
              <Button
                label="Excluir"
                onClick={() => deletarTecnico(rowData.id_tecnico)}
                className="p-button-danger"
              />
            </div>
          )}
        />
      </DataTable>
      <Toast ref={toast} />
    </section>
  );

}

export default Tecnico;
