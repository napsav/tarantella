require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var titoli = [];
let partecipanti = 0;
let ip = [];
// Index
app.get('/', (req, res) => {
    let alert = null;
    let done = false;
    if (ip.includes(req.ip)) {
        done = true;
        alert = "Hai già inserito un titolo!"
    }else if (titoli.length === partecipanti) {
        done = true;
        alert = "Titoli al completo"
    }
    res.render('index', {color: "#ff6161", done, alert})
})

app.post('/', (req, res) => {
    var done = false;
    var alert = null;
    var color = "#ff6161"
    var titolo = req.body.titolo;
    console.log(titoli.length)
    if (titolo === null || titolo === "") {
        alert = "Il titolo non può essere vuoto!";
    } else if (titoli.length === partecipanti) {
        done = true;
        alert = "Titoli al completo"
    } else if (ip.includes(req.ip)) {
        done = true;
        alert = "Hai già inserito un titolo!"
    } else if (titoli.length + 1 <= partecipanti) {
        alert = "Titolo inviato con successo, puoi chiudere la pagina.";
        color = "green"
        done = true;
        titoli.push(titolo.trim());
        ip.push(req.ip)
        console.log(ip)
    } else {
        alert="Errore del server e Saverio è un coglione"
    }
    res.render('index.pug',
        { color: color, alert: alert, done: done })
})


app.get('/partecipante', (req, res) => {
    var alert = null;
    var titoloscelto = null;
    if (titoli.length < partecipanti) {
        alert = "Non tutti hanno inviato il titolo, devi aspettare! (Se lo hanno inviato, prova a ricaricare la pagina)"
    } else if (titoli.length > partecipanti) {
        alert = "Qualche deficiente ha messo più di un titolo."
    } else {
        titoloscelto = titoli[Math.floor(Math.random() * titoli.length)];
    }
    res.render('partecipante', {
        alert: alert,
        titolo: titoloscelto,
    })
})

app.get('/admin', (req, res) => {
    res.render('reset.pug',
        { n: titoli.length, part: partecipanti })
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

app.post('/cambiopartecipanti', (req, res) => {
    const pass = process.env.PASSWORD;
    if (req.body.password === pass) {
        partecipanti = req.body.partecipanti;
        res.send("Fatto")
    } else {
        res.send("Non autorizzato");
    }
})

app.post('/resetip', (req, res) => {
    const pass = process.env.PASSWORD;
    if (req.body.password === pass) {
        ip = [];
        res.send("Fatto")
    } else {
        res.send("Non autorizzato");
    }
})

app.listen(port, () => {
    console.log(`let's goooooooooooooooooooooo`)
})