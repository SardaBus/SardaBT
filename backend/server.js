const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const {User,sequelize}=require('./models/user');

const app=express();

app.use(cors());
app.use(express.json());

const SECRET_KEY='sarda';
const REFRESH_SECRET_KEY='sardabt';

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