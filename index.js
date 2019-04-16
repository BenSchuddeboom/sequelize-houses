const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})
const app = express()

const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.TEXT,
    price: Sequelize.INTEGER
}, {
    tableName: 'houses'
})

House.sync()

const port = process.env.PORT
app.listen(port, () => `Listening on port ${port}`)

app.use(bodyParser.json())

app.get('/houses', function(req, res, next) {
    House.findAll().then(houses => {
        res.json({ houses: houses })
    })
    .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
    })
})

app.get('/houses/:id', function(req, res, next) {
    const id = req.params.id
    House.findByPk(id).then(house => {
        res.json({ house })
    })
    .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
    })
})

app.post('/houses', function(req, res) {
    console.log('Incoming data ', req.body)
    House
        .create(req.body)
        .then(house => res.status(201).json(house))
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})

app.put('/houses/:id', function (req, res) {
    const id = req.params.id
    House.findByPk(id).then(house => {
        house.update({
            title: 'Super Duper Million Dollar Mansion',
            description: 'Hello Im a description'
        }).then(house => console.log(`The house with ID ${house.id} is now updated`))
    })
    res.send()
})

app.delete('/houses/:id', function (req, res) {
    const id = req.params.id
    House.destroy({
        where: { id }
    }).then(console.log(`House with id ${id} has been deleted.`))
    res.send()
})