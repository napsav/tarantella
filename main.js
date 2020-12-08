require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = process.env.PORT || 80
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var titoli = [];

// Index
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    var done = false;
    var alert = null;
    var titolo = req.body.titolo;
    if (titolo === null || titolo === "") {
        alert = "Il titolo non può essere vuoto!";
    } else {
        alert = "Titolo inviato con successo";
        done = true;
        titoli.push(titolo.trim());
    }
    res.render('index.pug',
        { alert: alert, done: done })
})


app.get('/partecipante', (req, res) => {
    var alert = null;
    var titoloscelto = null;
    if (titoli.length < 3) {
        alert = "Non tutti hanno inviato il titolo, devi aspettare! (Se lo hanno inviato, prova a ricaricare la pagina)"
    } else if (titoli.length > 3) {
        alert = "Qualche deficiente ha messo più di un titolo."
    } else {
        titoloscelto = titoli[Math.floor(Math.random() * titoli.length)];
    }
    res.render('partecipante', {
        alert: alert,
        titolo: titoloscelto,
    })
})

app.get('/reset', (req, res) => {
    res.render('reset.pug',
        { n: titoli.length })
})

app.post('/reset', (req, res) => {
    const pass = process.env.PASSWORD;
    if (req.body.password === pass) {
        titoli = [];
        res.send("Fatto")
    } else {
        res.send("Non autorizzato");
    }
})

app.listen(port, () => {
    console.log(`let's goooooooooooooooooooooo`)
})