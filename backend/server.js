const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {User,sequelize} = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY='sarda';
const REFRESH_SECRET_KEY='sardabt';
const grant_type = 'client_credentials';
const client_id = '96dHZVzsAuv-SZd-ImmjvMIDbZbOH3BfMY-a3G0OvjzfX-drtxGKWLyluFV3IMAH0_e51_I1oOnNl1OXuzXBhQ=='
const client_secret = 'lrFxI-iSEg892AiBZWXI6Xr7LeL9uFh567Cwv-8nQPklYRnXus2FXQinEWvH3lq3JTmeYyhahOnYdO0QCANtwBYQTdKlmd4p'

let busLocations = {};

app.post('/api/location',(req,res) => {
    const {id,lat,lng}=req.body;
    busLocations[id]= {lat,lng};
    res.status(200).json({ message: 'Location updated'});
});

app.get('/api/locations',(req,res) => {
    res.status(200).json(busLocations);
});

app.get('/api/get-token', async (req, res) => {
    try {
        const response = await fetch(`https://outpost.mappls.com/api/security/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        res.status(200).json({ token: data.access_token });
      } catch (error) {
        console.error('Error fetching token:', error);
        res.status(500).json({ error: 'Failed to fetch token' });
      }
});

//register endpoint
app.post('/api/register',async(req,res)=>{
    const {username,password,usertype}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    try{
        await User.create({username,password:hashedPassword,usertype});
        res.status(201).send('User registered');
    }catch(error){
        res.status(400).send('Error registering user');
    }
});

//login endpoint
app.post('/api/login',async(req,res)=>{
    const { username, password }=req.body;
    const user=await User.findOne({where: { username } });

    if (user && (await bcrypt.compare(password, user.password))){
        const token=jwt.sign({ username, usertype: user.usertype},SECRET_KEY,{expiresIn:'15m'});
        const refreshToken=jwt.sign({username,usertype:user.usertype},REFRESH_SECRET_KEY,{expiresIn:'7d'});
        res.json({token,refreshToken});
    }else{
        res.status(401).send('Invalid credentials');
    }
});

//Refresh token endpoint
app.post('/api/refresh-token',(req,res)=>{
    const{refreshToken}=req.body;
    if(!refreshToken){
        return res.status(403).send('Refresh token is required');
    }
    try{
        const decoded=jwt.verify(refreshToken,REFRESH_SECRET_KEY);
        const token=jwt.sign({username:decoded.username,usertype:decoded.usertype},SECRET_KEY,{expiresIn:'15m'});
        
        const newRefreshToken=jwt.sign({username:decoded.username,usertype:decoded.usertype},REFRESH_SECRET_KEY,{expiresIn:'7d'});
        res.json({token,newRefreshToken});
    }catch(err){
        return res.status(401).send('Invalid Refresh Token');
    }
});

//verify token middleware
const verifyToken=(req,res,next)=>{
    const token=req.headers['authorization'];
    if(!token){
        return res.status(403).send('Token is required');
    }
    try{
        const decoded=jwt.verify(token,SECRET_KEY);
        req.user=decoded;
    }catch(err){
        return res.status(401).send('Invalid Token');
    }
    return next();
};

//Protected route example
app.get('/api/protected',verifyToken,(req, res)=>{
    res.send(`This is a protected route. User type: ${req.user.usertype}`);
});

//Listen on the the specified port
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL){
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports=app;