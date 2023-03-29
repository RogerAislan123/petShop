const express = require("express");
const bodyParser = require("body-parser");
const conexao = require("./bd/conexao");
const Sequelize = require("sequelize");
const Racas = require("./bd/Racas");
const RegistroPets = require("./bd/RegistroPets");
const Servicos = require("./bd/Servicos");
const formataData = require("./public/js/util");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

conexao.authenticate();

app.get("/", function (req, res) {
  res.render("index");
});

// ---- requisiçoes para racas ----

app.get("/racas/lista/:mensagem?", function (req, res) {
  Racas.findAll({ order: ["nome"] }).then(function (racas) {
    if (req.params.mensagem)
      res.render("racas/racas", {
        racas: racas,
        mensagem:
          "Não foi possível, pois já há uma raça relacionada a esta categoria.",
      });
    else res.render("racas/racas", { racas: racas, mensagem: "" });
  });
}); //ok

app.get("/racas/novo", function (req, res) {
  res.render("racas/novo", { mensagem: "" });
}); //ok

app.post("/racas/salvar", function (req, res) {
  let nome = req.body.nome;
  Racas.create({ nome: nome }).then(
    res.render("racas/novo", { mensagem: "Raça incluida." })
  );
}); //ok

app.get("/racas/editar/:id", function (req, res) {
  let id = req.params.id;
  Racas.findByPk(id).then(function (raca) {
    res.render("racas/editar", { raca: raca });
  });
}); //ok

app.post("/racas/atualizar", function (req, res) {
  let id = req.body.id;
  let nome = req.body.nome;
  Racas.update({ nome: nome }, { where: { id: id } }).then(function () {
    res.redirect("/racas/lista");
  });
}); //ok

app.get("/racas/excluir/:id", function (req, res) {
  let id = req.params.id;
  Racas.destroy({ where: { id: id } })
    .then(function () {
      res.redirect("/racas/lista");
    })
    .catch(function (err) {
      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        res.redirect("/racas/lista/erro");
      }
    });
}); //ok

// ---- requisiçoes para registroPets ----

app.get("/registroPets", function (req, res) {
  RegistroPets.findAll({ order: ["nome"], include: [{ model: Racas }] }).then(
    function (registroPets) {
      res.render("registroPets/registroPets", {
        registroPets: registroPets,
        formataData: formataData,
      });
    }
  );
}); //ok

app.get("/registroPets/novo/:mensagem?", function (req, res) {
  Racas.findAll({ order: ["nome"] }).then(function (racas) {
    if (req.params.mensagem)
      res.render("registroPets/novo", {
        mensagem: "Registro incluído.",
        racas: racas,
      });
    else res.render("registroPets/novo", { mensagem: "", racas: racas });
  });
}); //ok

app.post("/registroPets/salvar", function (req, res) {
  let proprietario = req.body.proprietario;
  let nome = req.body.nome;
  let nascimento = req.body.nascimento;
  let raca = req.body.raca;
  RegistroPets.create({
    proprietario: proprietario,
    nome: nome,
    nascimento: nascimento,
    racaId: raca,
  }).then(res.redirect("/registroPets/novo/incluido"));
}); //ok

app.get("/registroPets/editar/:id", function (req, res) {
  let id = req.params.id;
  RegistroPets.findByPk(id).then(function (registroPet) {
    Racas.findAll().then(function (racas) {
      res.render("registroPets/editar", {
        registroPet: registroPet,
        racas: racas,
        formataData: formataData,
      });
    });
  });
}); //ok

app.post("/registroPets/atualizar", function (req, res) {
  let id = req.body.id;
  let proprietario = req.body.proprietario;
  let nome = req.body.nome;
  let nascimento = req.body.nascimento;
  let raca = req.body.raca;
  RegistroPets.update(
    {
      proprietario: proprietario,
      nome: nome,
      nascimento: nascimento,
      racaId: raca,
    },
    { where: { id: id } }
  ).then(function () {
    res.redirect("/registroPets");
  });
}); //ok

app.get("/registroPets/excluir/:id", function (req, res) {
  let id = req.params.id;
  RegistroPets.destroy({ where: { id: id } }).then(function () {
    res.redirect("/registroPets");
  });
}); //ok

// ---- requisiçoes para servicos ---- TUDO OK

app.get("/servicos", function (req, res) {
  Servicos.findAll({ order: ["descricao"] }).then(function (servicos) {
    res.render("servicos/servicos", { servicos: servicos });
  });
});

app.get("/servicos", function (req, res) {
  res.render("servicos/servicos");
});

app.get("/servicos/novo", function (req, res) {
  res.render("servicos/novo", { mensagem: "" });
});

app.post("/servicos/salvar", function (req, res) {
  let descricao = req.body.descricao;
  let preco = parseFloat(req.body.preco);
  let data = req.body.data;
  Servicos.create({ descricao: descricao, preco: preco, data: data }).then(
    res.render("servicos/novo", { mensagem: "Serviço incluido." })
  );
});

app.get("/servicos/editar/:id", function (req, res) {
  let id = req.params.id;
  Servicos.findByPk(id).then(function (servico) {
    res.render("servicos/editar", { servico: servico });
  });
});

app.post("/servicos/atualizar", function (req, res) {
  let id = req.body.id;
  let descricao = req.body.descricao;
  let preco = parseFloat(req.body.preco);
  let data = req.body.data;
  Servicos.update(
    { descricao: descricao, preco: preco, data: data },
    { where: { id: id } }
  ).then(function () {
    res.redirect("/servicos");
  });
});

app.get("/servicos/excluir/:id", function (req, res) {
  let id = req.params.id;
  Servicos.destroy({ where: { id: id } }).then(function () {
    res.redirect("/servicos");
  });
});

app.listen(3000);
