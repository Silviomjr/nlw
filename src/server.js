const express = require("express")
const server = express()

//pegar o db

const db = require("./database/db")
//config pasta publica

server.use(express.static("public"))

//habilitar o uso do rea.body na app

server.use(express.urlencoded({extended: true}))


//utilizando template engine
const nunjucks = require("nunjucks")

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})



//Configurar caminhos da app

//pagina inicial
//rea: requisição
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um título"})
})

server.get("/creat-point", (req, res) => {

    // req.query: Query strings da nossa url
    console.log(req.query)



    return res.render("creat-point.html")
})

server.post("/savepoint", (req, res) => {
    
    // console.log(req.body)

    //inserir dados no banco de dados

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
            ) VALUES (?, ?, ?, ?, ?, ?, ?);
        `
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData (err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("creat-point.html", {saved: true})
    }


    db.run(query, values, afterInsertData)
    
})






server.get("/search", (req, res) => {
    // pegar os dados do db

    const search = req.query.search

    if(search == "") {
        //pesquisa vazia
        //mostrar a página html com o db
        return res.render("search-results.html", { total: 0})

    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a página html com o db
        return res.render("search-results.html", { places: rows, total: total})
    })    
})


//ligar o servidor
server.listen(3000)
