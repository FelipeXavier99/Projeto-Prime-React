import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import styles from '../pages_css/TipoLance.module.css';
import styles from '../pages_css/Selecao.modules.css';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

//bandeirass
import flagSpain1 from '../assets/flag-spain1.png';
import flagAfric from '../assets/flag-afric.png';
import flagAlem from '../assets/flag-alem.png';
import flagArg from '../assets/flag-arg.png';
import flagArge from '../assets/flag-arge.png';
import flagAus from '../assets/flag-aus.png';
import flagBel from '../assets/flag-bel.png';
import flagBra from '../assets/flag-bra.png';
import flagCam from '../assets/flag-cam.png';
import flagCan from '../assets/flag-can.png';
import flagQat from '../assets/flag-qat.png';
import flagChi from '../assets/flag-chi.png';
import flagChin from '../assets/flag-chin.png';
import flagCore from '../assets/flag-core.png';
import flagAleo from '../assets/flag-aleo.png';
import flagCost from '../assets/flag-cost.png';


function getTipoLance() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const selecao = urlParams.get('selecao');
  return selecao;
}

function Selecao() {
  const [copa, setCopas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selecao, setNome] = useState('');
  const [continente, setContinente] = useState('');
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
    const selecao = getTipoLance();
    axios.get(`http://localhost:3001/selecao?selecao=${selecao}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (editingTipoLance) {
      setNome(editingTipoLance.selecao);
      setContinente(editingTipoLance.continente);
    } else {
      setNome('');
      setContinente('');
    }
  }, [editingTipoLance]);


  //condiçao pra inserir e editar

  const handleSaveTipoLance = () => {
    if (editingTipoLance) {
      const tipoLanceData = { selecao, continente };
      axios.put(`http://localhost:3001/selecao/${editingTipoLance.idSelecao}`, tipoLanceData)
        .then((response) => {
          console.log("Tipo Lance atualizado com sucesso");
          setEditingTipoLance(null);
          setNome('');
          setContinente('');
          setShowDialog(false);
          fetchTipoLance(); // Chama a função para buscar novamente os dados após a atualização
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const tipoLanceData = { selecao, continente };
      axios.post("http://localhost:3001/registerSelecao", tipoLanceData)
        .then((response) => {
          console.log(response.data);
          setShowDialog(false);
          setNome('');
          setContinente('');
          fetchTipoLance(); // Chama a função para buscar novamente os dados após a inserção
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

  const handleEdit = (tipoLance) => {
    setEditingTipoLance(tipoLance);
    setNome(tipoLance.selecao);
    setContinente(tipoLance.continente);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setEditingTipoLance(null);
    setShowDialog(false);
    setNome('');
    setContinente('');
  };

  const dialogFooter = (
    <div className="p-dialog-footer">
      <Button label="Salvar" onClick={handleSaveTipoLance} />
      <Button label="Cancelar" onClick={handleCancel} className="p-button-secondary" />
    </div>
  );


  const bandeiras = {
    'Espanha': flagSpain1,
    'Africa do Sul': flagAfric,
    'Alemanha': flagAlem,
    'Alemanha Ocindental': flagAleo,
    'Argélia': flagArg,
    'Argentina': flagArge,
    'Australia': flagAus,
    'Belgia': flagBel,
    'Brasil': flagBra,
    'Camarões': flagCam,
    'Canada': flagCan,
    'Catar': flagQat,
    'Chile': flagChi,
    'China': flagChin,
    'COreia do sul': flagCore,
    'Costa Rica': flagCost,
    

    // Adicione as outras seleções e seus caminhos de imagem aqui
  };
  
  //condição pra mostrar a bandeira correta ao lado do nome da seleçao
  const renderSelecao = (rowData) => {
    const bandeira = bandeiras[rowData.selecao];
    if (bandeira) {
      return (
        <div className="flex align-items-center gap-2">
          <img
            className="flag-es"
            src={bandeira}
            alt={rowData.selecao}
            style={{ width: '50px', height: 'auto' }}
          />
          <span>{rowData.selecao}</span>
        </div>
      );
    } else {
      return <span>{rowData.selecao}</span>;
    }
  };


  const deletarTipoLance = (tipoLanceId) => {
    axios
      .delete(`http://localhost:3001/deleteSelecao/${tipoLanceId}`)
      .then((response) => {
        console.log("Tipo Lance excluído com sucesso");
        fetchTipoLance(); // Chama a função para buscar novamente os dados após a exclusão
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        console.log("Erro ao excluir tipo de lance:", error);
      });
  };

  // aqui mostra os dados na tabela
  const fetchTipoLance = () => {
    const selecao = getTipoLance();
    axios.get(`http://localhost:3001/selecao?selecao=${selecao}`)
      .then((response) => {
        setCopas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className={styles.tipoLance_container}>
    <h1 style={{
      fontSize: '48px',
      textShadow: '0px 0px 10px rgba(255, 255, 255, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.8), 0px 0px 30px rgba(255, 255, 255, 0.8), 0px 0px 40px rgba(255, 255, 255, 0.8)',
      transform: 'perspective(1000px) rotateY(20deg)',
      position: 'relative',
      left: '450px',
      color:  'rgb(4, 10, 48)'
    }}>
      Tabela Seleção
    </h1>

   

      
      <div >
        <Button label="Inserir Seleção" onClick={handleClick} style={{ position: 'relative', left: '250px' }} />
        

        <Dialog
          header={editingTipoLance ? "Editar Seleção" : "Inserir Seleção"}
          visible={showDialog}
          onHide={handleCancel}
          footer={dialogFooter}
          dismissableMask
        >
          <div className="formulario">
            <div className="p-field">
              <label htmlFor="selecao">Nome</label>
              <InputText id="selecao" value={selecao} onChange={(e) => setNome(e.target.value)} placeholder="Digite a Seleção" />
            </div>
            <div className="p-field">
              <label htmlFor="continente">Continente</label>
              <InputText id="continente" value={continente} onChange={(e) => setContinente(e.target.value)} placeholder="Digite o continente" />
            </div>
          </div>
        </Dialog>
      </div>

      <DataTable value={copa} style={{ position: 'relative', left: '250px', width: '150%' }}>
        <Column field="selecao" header="SELEÇÃO" className={styles.cor_cabecalho} body={renderSelecao} />
        <Column field="continente" header="CONTINENTE" className={styles.cor_cabecalho} />
        <Column header="AÇÕES" className={styles.cor_cabecalho} body={(rowData) => (
          <div className={styles.button_container}>
            <Button label="Editar" onClick={() => handleEdit(rowData)} className="p-button-success" />
            <Button label="Excluir" onClick={() => deletarTipoLance(rowData.idSelecao)} className="p-button-danger" />
          </div>
        )} />
      </DataTable>
      <Toast ref={toast} />
    </section>
  );
}

export default Selecao;
