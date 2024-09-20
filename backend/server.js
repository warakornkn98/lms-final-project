const express = require('express');
const app = express()

const morgan = require('morgan')
const cors = require('cors')
const bodyParse = require('body-parser')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParse.json({limit:'10mb'}))

const { readdirSync } = require('fs')

//Route
readdirSync('./routes').map((r)=>app.use('/api',require('./routes/'+r)))

app.listen(5000,()=>{
    console.log('server is running on port 5000');
})