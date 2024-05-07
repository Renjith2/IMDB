const express= require('express')
const mysql=require('mysql')
const cors=require('cors')
const app= express()

app.use(cors())
app.use(express.json())
const userRouter= require('./api/userroute')
console.log('Connecting to MySQL database...');


app.use('/api/users',userRouter)
const novieRoute=require('./api/movieRoute')
app.use('/api/movie',novieRoute)

const producerroute=require('./api/producerRoute')
app.use('/api/producers',producerroute)

const actorRoute=require('./api/actorRoute')
app.use('/api/actors',actorRoute)


      app.get('/',(req,res)=>{
  res.send("hii")
})

const movieRoute= require('./api/movieRoute')
app.use('/api/movies',movieRoute)
app.listen(8080,()=>{
  console.log("listening")
})
