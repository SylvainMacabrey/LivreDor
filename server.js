let express = require('express')
let app = express()
let bodyParser = require('body-Parser')
let session = require('express-session')

app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json)
app.use(session({
    secret: 'azerty',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.use(require('./middlewares/flash'))

app.get('/', (request, response) => {
    let Message = require('./models/message')
    Message.all((messages) => {
        response.render('pages/index', {messages: messages})
    })
})

app.post('/', (request, response) => {
    if(request.body.message === undefined || request.body.message === '') {
        //response.render('pages/index', {error: 'Vous n\'avez pas entré de message'}) 
        request.flash('error', 'Vous n\'avez pas posté de message')
        response.redirect('/');
    } else {
        let Message = require('./models/message')
        Message.create(request.body.message, () => {
            request.flash('success', 'Merci')
            response.redirect('/');
        })
    }
})

app.get('/message/:id', (request, response) => {
    let Message = require('./models/message')
    Message.find(request.params.id, (message) => {
        response.render('pages/show', {message: message})
    })
}) 

app.listen(4444)
