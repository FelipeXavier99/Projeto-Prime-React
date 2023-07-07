import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";
import "./App.css";
import foto from "./assets/foto.png";

import Container from "./layout/Container";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Home from "./pages/Home";
import Copas from "./pages/Copas";
import EditCopas from "./pages/EditCopas";
import Idiomas from "./pages/Idiomas";
import EditIdioma from "./pages/EditIdioma";
import TipoLance from "./pages/TipoLance";
import Lance from "./pages/Lance";
import Continente from "./pages/Continente";
import PaisSede from "./pages/PaisSede";
import Tecnico from "./pages/Tecnico";
import Selecao from "./pages/Selecao";

export default function App() {
  
  const [listCard, setListCard] = useState([]);
  console.log(listCard);


  useEffect(() => {
    Axios.get("http://localhost:3001/getCards").then((response) => {
      setListCard(response.data);
    });
  }, []);



  return (
    <Router>
      <div className="background">
        <img src={foto} alt="foto1" />
      </div>
  {/*IMPORTANDO BARRA DE NAVEGAÇÃO*/}
      <Navbar />

  {/*MENUS*/}
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/copas" element={<Copas />} />
          <Route exact path="/editCopas" element={<EditCopas />} /> {/*sempre tem q criar uma rota mesmo q nao mostre*/}
          <Route exact path="/idiomas" element={<Idiomas />} />
          <Route exact path="/editidioma" element={<EditIdioma />} />
          <Route exact path="/tipolance" element={<TipoLance />} />
          <Route exact path="/lance" element={<Lance/>} />
          <Route exact path="/continente" element={<Continente/>} />
          <Route exact path="/paissede" element={<PaisSede/>} />
          <Route exact path="/tecnico" element={<Tecnico/>} />
          <Route exact path="/selecao" element={<Selecao/>} />
        </Routes>


   
      </Container>

      {/*IMPORTANDO RODAPÉ*/}
      <Footer />
    </Router>
  );
}
