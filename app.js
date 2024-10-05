const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const cors = require('cors');

const app = express();
app.use(express.static('public'));
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow this origin to access the server
    methods: ['GET', 'POST', 'DELETE'], // Allow these HTTP methods
    credentials: true, // Allow credentials
}));
app.use(express.json());

const posts = [
    {
        username : 'Kyle',
        title : 'Post1'
    },
    {
        username : 'Jim',
        title : 'Post2'
    }
]

app.get('/posts' , authenticateToken, (req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name  ))
})


//middleware which authenticate the user
function authenticateToken(req, res , next){
    const  authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token , process.env.ACCESS_TOKEN_SECRET, (err , user)=>{
        if(err) return res.sendStatus(403);
        req.user = user
        next();
    });

    

}

app.listen(process.env.PORT || 3000 ,()=>{
    console.log('Port is listening ')
})