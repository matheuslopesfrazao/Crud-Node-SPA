const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'db'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


/* ROTAS REST */

server.get('/', restify.plugins.serveStatic({ /* Esse bloco de código, diz que quando acessarmos a rota principal, irá aparecer a página "index.html" do diretório "dist" */ 
  directory: './dist', /* Diretório padrão para servir arquivos estáticos */
  file: 'index.html' /* arquivo padrão que será retornado quando o diretório for acessado */
}));


server.get('/read', function (req, res, next) {
  
  knex('rest').then((dados)=>{

    res.send(dados);

  }, next);
  
  return next();

});

server.post('/create', function (req, res, next) { /* Abre Rota Criar */

  knex('rest')
  .insert(req.body)
  .then((dados)=>{

    res.send(dados);

  }, next);

}); /* Fecha Rota Criar */


server.get('/show/:id', function (req, res, next) { /* Abre Rota Consultar */
  
  const { id } = req.params;

  knex('rest')
  
  .where('id', id)
  .first()
  .then((dados)=>{
    if(!dados) {
      return res.send(new errs.BadRequestError('Nada foi encontrado'));
    } else {
      res.send(dados);
    }
    

  }, next);
}); /* Fecha Rota Consultar */


server.put('/update/:id', function (req, res, next) { /* Abre Rota Atualizar */
  
  const { id } = req.params;

  knex('rest')
  
  .where('id', id)
  .update(req.body)
  .then((dados)=>{
    if(!dados) {
      return res.send(new errs.BadRequestError('Nada foi encontrado'));
    } else {
      res.send("Dados atualizados com sucesso!");
    }
    

  }, next);
}); /* Fecha Rota Atualizar */


server.del('/delete/:id', function (req, res, next) { /* Abre Rota Excluir */
  
  const { id } = req.params;

  knex('rest')
  
  .where('id', id)
  .delete()
  .then((dados)=>{
    if(!dados) {
      return res.send(new errs.BadRequestError('Nada foi encontrado'));
    } else {
      res.send("Dados Excluídos com sucesso!");
    }
    

  }, next);
}); /* Fecha Rota Excluir */