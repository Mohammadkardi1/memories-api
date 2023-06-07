import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import postRoutes from './routes/postRoute.js';
import userRoutes from './routes/authRoute.js'



const app = express() 
dotenv.config()

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))


// middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())

// We add the prefix "posts" to all routes in psotRoutes file
app.use('/api/posts', postRoutes)


app.use('/api/auth', userRoutes)



app.get('/',(req,res)=>{
    res.status(200).json({
      message:'hello vercel'
    })
  })

// Credentials 
const CONNECTION_URL = process.env.MONGO
const PORT = process.env.PORT || 5000;


mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})

// establish a connection between a Node.js application and a MongoDB database
// we used then and catch because the following method return promise
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => {
        console.log(error.message)
    }) 



// mongoose.set('useFindAndModify', false)

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);