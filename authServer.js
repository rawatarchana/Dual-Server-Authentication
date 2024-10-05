const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow this origin to access the server
    methods: ['GET', 'POST', 'DELETE'], // Allow these HTTP methods
    credentials: true, // Allow credentials
}));
app.use(express.static('public'));
let refreshTokens = [];


app.post('/token' , (req, res)=>{
    const refreshToken = req.body.token ;
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    
    jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err , user)=>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name : user.name});
        res.json({accessToken : accessToken});

    })

})
app.delete('/logout' , (req, res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204);
})
app.post('/login' , (req,res)=>{
    //user authentication
    const username = req.body.username;
    const user = {name : username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user , process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken);

    res.json({accessToken : accessToken , refreshToken : refreshToken});
})

//middleware which authenticate the user
function generateAccessToken(user){
   return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '5s'});
}

app.listen( process.env.PORT || 4000,()=>{
    console.log('Port is listening ')
}) 