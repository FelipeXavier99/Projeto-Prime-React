
//Conexão com o banco
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "copas",
});

app.use(express.json());
app.use(cors());

/* TENTAR RESOLVER ERRO 404 QDO INICIA PROJETO!
setTimeout(() => {
  app.listen(3001, () => {
    console.log("Rodando na porta 3001");
  });
}, 1000); // Esperar 1 segundo antes de iniciar o servidor
*/

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});


/*    -----------------INICIO COPA    -------------------                   */



app.get("/copa", (req, res) => {
  let query = "select co.ano , se.nome , co.id_pais_sede from copa co inner Join selecao se on se.id_selecao = co.id_pais_sede order by co.ano";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/paises", (req, res) => {
  let query = "select nome, id_selecao as id from selecao order by trim (nome)";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});



app.post("/register", (req, res) => {
  const { ano } = req.body;
  const { nomePais } = req.body;


  let mysql = "INSERT INTO copa ( ano, id_pais_sede) VALUES (?, ?)";
  db.query(mysql, [ano, nomePais], (err, result) => {
    res.send(result);
  });
});



app.post("/search", (req, res) => {
  const { ano } = req.body;
  const { nomePais } = req.body;

  let mysql =
    "SELECT * from copa WHERE ano = ? AND  id_pais_sede = ?";
  db.query(mysql, [ano, nomePais], (err, result) => {  /*  talvez aqui seja parseint*/
    if (err) res.send(err);
    res.send(result);
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  let mysql = "DELETE FROM copa WHERE ano = ?";
  db.query(mysql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});





/*   ainda nao testado  */
app.put("/editCopas", (req, res) => {
  const { id } = req.body;
  const { name } = req.body;

  let mysql = "UPDATE copa SET ano = ?, id_pais_sede=? WHERE id_pais_sede = ?";
  db.query(mysql, [name, cost], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});






/*    -----------------FIM COPA    -------------------                   */







/* -------------------- INICIO IDIOMA--------------------*/


app.get("/idioma", (req, res) => {
  let query = "select *from idioma";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerIdioma", (req, res) => {
  const { ano } = req.body;


  let mysql = "INSERT INTO idioma (nome) VALUES (?)";
  db.query(mysql, [ano,], (err, result) => {
    res.send(result);
  });
});



app.post("/searchIdioma", (req, res) => {
  const { ano } = req.body;

  let mysql =
    "SELECT * from idioma WHERE nome = ? ";
  db.query(mysql, [ano], (err, result) => {  
    if (err) res.send(err);
    res.send(result);
  });
});


app.delete("/deleteIdioma/:id", (req, res) => {
  const { id } = req.params;
  let mysql = "DELETE FROM idioma WHERE id_idioma = ?";
  db.query(mysql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


/*    -----------------FIM IDIOMA    -------------------                   */






/* -------------------- INICIO TIPO LANCE--------------------*/


app.get("/tipolance", (req, res) => {
  let query = "select *from tipo_lance";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerTipoLance", (req, res) => {
  const { nome } = req.body;

  let mysql = "INSERT INTO tipo_lance (nome) VALUES (?)";
  db.query(mysql, [nome,], (err, result) => {
    res.send(result);
  });
});



app.put('/tipoLance/:id', async (req, res) => {
  const nome = req.body.nome;
  const { id } = req.params;
  console.log("ID do tipo de lance a ser Editado:", id);


  let mysql = `update tipo_lance set nome = '${nome}' where id_tipo_lance=${id}`;
  db.query(mysql, [nome,], (err, result) => {
    res.send(result);
  });
});


app.delete("/deleteTipoLance/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID do tipo de lance a ser excluído:", id);

  let mysql = "DELETE FROM tipo_lance WHERE id_tipo_lance = ?";
  db.query(mysql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir tipo de lance");
    } else {
      console.log("Tipo de lance excluído com sucesso");
      res.send(result);
    }
  });
});




/*    -----------------FIM TIPO LANCE    -------------------                   */








/* -------------------- INICIO CONTINENTE--------------------*/



app.get("/continente", (req, res) => {
  let query = "select *from continente";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerContinente", (req, res) => {
  const { nome } = req.body;

  let mysql = "INSERT INTO continente (nome) VALUES (?)";
  db.query(mysql, [nome,], (err, result) => {
    res.send(result);
  });
});


app.put('/continente/:id', async (req, res) => {
  const nome = req.body.nome;
  const { id } = req.params;
  console.log("ID do Continente a ser Editado:", id);


  let mysql = `update continente set nome = '${nome}' where id_continente=${id}`;
  db.query(mysql, [nome,], (err, result) => {
    res.send(result);
  });
});

app.delete("/deleteContinente/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID do Continente a ser excluído:", id);

  let mysql = "DELETE FROM continente WHERE id_continente = ?";
  db.query(mysql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir continente");
    } else {
      console.log("Continente excluído com sucesso");
      res.send(result);
    }
  });
});




/* -------------------- FIM CONTINENTE--------------------*/







/* -------------------- INICIO SELEÇÃO--------------------*/

app.get("/selecao", (req, res) => {
  let query = "select con.nome as continente , sel.nome as selecao,sel.id_selecao as idSelecao from selecao sel inner Join continente con on con.id_continente = sel.id_continente order by trim (sel.nome)";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerSelecao", (req, res) => {

  const { selecao, continente } = req.body;

  db.query('SELECT id_continente FROM continente WHERE nome = ?', [continente], (err, results) => {
    const idContinente2 = results[0].id_continente;

    const mysql = "INSERT INTO selecao (nome, id_continente) VALUES (?, ?)";
    db.query(mysql, [selecao, idContinente2], (err, result) => {

      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.send(result);
    });
  });
});


// pendente

app.put('/selecao/:id', async (req, res) => {
  const selecao = req.body.selecao;
  const continente = req.body.continente;
  const { id } = req.params;

  db.query('SELECT id_continente FROM continente WHERE nome = ?', [continente], (err, results) => {
    const idContinente = results[0].id_continente;

    let mysql = `UPDATE selecao SET nome = '${selecao}', id_continente = '${idContinente}' WHERE id_selecao = ${id}`;
    db.query(mysql, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar seleção');
      } else {
        res.send(result);
      }
    });
  });
});





app.delete("/deleteSelecao/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID do Seleção a ser excluído:", id);

  let mysql = "DELETE FROM selecao WHERE id_selecao =?";
  db.query(mysql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir Seleção");
    } else {
      console.log("Seleção excluído com sucesso");
      res.send(result);
    }
  });
});








/* -------------------- FIM SELEÇÃO--------------------*/








/* -------------------- INICIO PAIS SEDE--------------------*/


app.get("/paisSede", (req, res) => {
  let query = "SELECT ps.ano_copa AS Copa, se.nome AS Sede,ps.id_pais AS idPaisSede FROM pais_sede ps INNER JOIN selecao se ON se.id_selecao = ps.id_pais";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/registerPais", (req, res) => {
  const { nome, ano } = req.body;

  db.query('SELECT id_selecao FROM selecao WHERE nome = ?', [nome], (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    const idSelecao = results[0].id_selecao;

    const mysql = "INSERT INTO pais_sede (id_pais, ano_copa) VALUES (?, ?)";
    db.query(mysql, [idSelecao, ano], (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.send(result);
    });
  });
});

app.put('/paisSede/:id', async (req, res) => {
  const { nome, ano } = req.body;
  const { id } = req.params;

  db.query('SELECT id_selecao FROM selecao WHERE nome = ?', [nome], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar a seleção');
      return;
    }

    if (results && results.length > 0) {
      const idSelecao2 = results[0].id_selecao;

      let mysql = 'UPDATE pais_sede SET id_pais = ?, ano_copa = ? WHERE id_pais = ?';
      db.query(mysql, [idSelecao2, ano, id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao atualizar o país sede');
          return;
        }

        res.send(result);
      });
    } else {
      res.status(404).send('Seleção não encontrada');
    }
  });
});




app.delete("/deletePais/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID do Pais Sede a ser excluído:", id);

  let mysql = "DELETE FROM pais_sede WHERE id_pais =?";
  db.query(mysql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir Pais Sede ");
    } else {
      console.log("Pais Sede  excluído com sucesso");
      res.send(result);
    }
  });
});


/* -------------------- FIM PAIS SEDE--------------------*/








/* -------------------- INICIO LANCE--------------------*/

app.get("/lance", (req, res) => {
  let query =
    "SELECT la.id_lance AS idLance, j1.nome AS Jogador1, " +
    "j2.nome AS Jogador2, s1.nome AS Selecao1, s2.nome AS Selecao2, " +
    "c.ano AS Copa, ps.nome AS PaisSede, ju.nome AS Juiz, " +
    "tl.nome AS TipoDoLance " +
    "FROM lance la " +
    "INNER JOIN jogador j1 ON j1.id_jogador = la.id_jogador1 " +
    "INNER JOIN jogador j2 ON j2.id_jogador = la.id_jogador2 " +
    "INNER JOIN jogo j ON j.id_jogo = la.id_jogo " +
    "INNER JOIN selecao s1 ON s1.id_selecao = j.id_selecao1 " +
    "INNER JOIN selecao s2 ON s2.id_selecao = j.id_selecao2 " +
    "INNER JOIN juiz ju ON ju.id_juiz = j.id_juiz " +
    "INNER JOIN copa c ON c.ano = j.ano_copa " +
    "INNER JOIN selecao ps ON ps.id_selecao = c.id_pais_sede " +
    "INNER JOIN tipo_lance tl ON tl.id_tipo_lance = la.id_tipo_lance " +
    "WHERE s1.id_selecao = j1.id_selecao AND s2.id_selecao = j2.id_selecao;";

  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.post("/registerLance", (req, res) => {
  const { tipodoLance, jogador1, jogador2, juiz } = req.body;

  db.query('SELECT id_tipo_lance FROM tipo_lance WHERE nome = ?', [tipodoLance], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao executar a consulta');
    }

    console.log(results); // Adicione esta linha para verificar o valor de 'results'

    if (results.length === 0) {
      return res.status(404).send('Tipo de lance não encontrado');
    }

    const idTipoLance2 = results[0].id_tipo_lance;

    db.query('SELECT id_jogador FROM jogador WHERE nome = ?', [jogador1], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao executar a consulta');
      }

      if (results.length === 0) {
        return res.status(404).send('Jogador 1 não encontrado');
      }

      const j1 = results[0].id_jogador;

      db.query('SELECT id_jogador FROM jogador WHERE nome = ?', [jogador2], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Erro ao executar a consulta');
        }

        if (results.length === 0) {
          return res.status(404).send('Jogador 2 não encontrado');
        }

        const j2 = results[0].id_jogador;

        db.query('SELECT id_juiz FROM juiz WHERE nome = ?', [juiz], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Erro ao executar a consulta');
          }

          if (results.length === 0) {
            return res.status(404).send('Juiz não encontrado');
          }

          const idJui = results[0].id_juiz;

          db.query('SELECT id_jogo FROM jogo WHERE id_juiz = ?', [idJui], (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Erro ao executar a consulta');
            }

            if (results.length === 0) {
              return res.status(404).send('Jogo não encontrado');
            }

            const idJogoJuiz = results[0].id_jogo;

            let mysql = "INSERT INTO lance (id_jogador1,id_jogador2,id_jogo,id_tipo_lance) VALUES (?, ?, ?, ?)";
            db.query(mysql, [j1, j2, idJogoJuiz, idTipoLance2], (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Erro ao inserir o lance');
              }

              res.send(result);
            });
          });
        });
      });
    });
  });
});





app.put('/lance/:idLance', async (req, res) => {
  const { tipodoLance, jogador1, jogador2 } = req.body;
  const { idLance } = req.params;

  db.query('SELECT id_jogador FROM jogador WHERE nome = ?', [jogador1], (err, results) => {
    if (results && results.length > 0) {
      const j1 = results[0].id_jogador;

      db.query('SELECT id_jogador FROM jogador WHERE nome = ?', [jogador2], (err, results) => {
        if (results && results.length > 0) {
          const j2 = results[0].id_jogador;

          db.query('SELECT id_tipo_lance FROM tipo_lance WHERE nome = ?', [tipodoLance], (err, results) => {
            if (results && results.length > 0) {
              const tp_lance = results[0].id_tipo_lance;

              let mysql = `UPDATE lance SET id_jogador1='${j1}', id_jogador2='${j2}', id_tipo_lance=${tp_lance} WHERE id_lance=${idLance}`;
              db.query(mysql, [j1, j2, tp_lance, idLance], (err, result) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('Erro ao atualizar o lance');
                } else {
                  res.send(result);
                }
              });
            } else {
              res.status(404).send('Tipo de lance não encontrado');
            }
          });
        } else {
          res.status(404).send('Jogador 2 não encontrado');
        }
      });
    } else {
      res.status(404).send('Jogador 1 não encontrado');
    }
  });
});







app.delete("/deleteLance/:idLance", (req, res) => {
  const { idLance } = req.params;

  if (!idLance) {
    return res.status(400).send("ID do Lance inválido");
  }

  console.log("ID Lance a ser excluído:", idLance);

  let mysql = "DELETE FROM lance WHERE id_lance = ?";
  db.query(mysql, [idLance], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir Lance");
    } else {
      console.log("Lance excluído com sucesso");
      res.send(result);
    }
  });
});

//mostrar juízes no input

app.get("/juizes", (req, res) => {
  let query = "select DISTINCT nome from jogo j inner join juiz ju on ju.id_juiz = j.id_juiz;";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});



/* -------------------- FIM LANCE--------------------*/



/* -------------------- INICIO Técnico--------------------*/


app.get("/tecnico", (req, res) => {
  let query = "select *from tecnico";
  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});



app.post("/registerTecnico", (req, res) => {
  const { nome } = req.body;
  const {ano_nascimento} = req.body;

  let mysql = "INSERT INTO tecnico (nome, ano_nascimento) VALUES (?,?)";
  db.query(mysql, [nome,ano_nascimento], (err, result) => {
    res.send(result);
  });
});

app.put('/tecnico/:id_tecnico', async (req, res) => {
  const nome = req.body.nome;
  const { id_tecnico } = req.params;
  const {ano_nascimento} = req.body;
  console.log("ID do técnico a ser Editado:", id_tecnico);


  let mysql = `update tecnico set nome = '${nome}', ano_nascimento =${ano_nascimento} where id_tecnico=${id_tecnico}`;
  db.query(mysql, [nome,], (err, result) => {
    res.send(result);
  });
});


app.delete("/deleteTecnico/:id_tecnico", (req, res) => {
  const { id_tecnico } = req.params;
  console.log("ID  a ser excluído:", id_tecnico);

  let mysql = "DELETE FROM tecnico WHERE id_tecnico = ?";
  db.query(mysql, [id_tecnico], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao excluir ");
    } else {
      console.log(" excluído com sucesso");
      res.send(result);
    }
  });
});

/* -------------------- FIM Técnico--------------------*/