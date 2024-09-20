const jwt = require('jsonwebtoken')
const SECRET_KEY = 'jwtsecret';

//Authentication
exports.auth = async(req,res,next) => {
    try{ 
        const token = req.headers["authtoken"] 
        if(!token){
            return res.status(401).send('No token')
        }

        
        //1.ตรวจสอบ token ด้วยฟังก์ชัน jwt.verify

        if(!jwt.verify(token,SECRET_KEY)){
            return res.status(401).send('No auth')
        }
        
        next()

    }catch (err){
        console.log(err)
        res.send('Token Invalid').status(500)
    }
}

//Authorization
exports.checkAdmin = async(req, res, next)=> {
    try{
        const token = req.headers["authtoken"]
        if(!token){
            return res.status(401).send('No token')
        }
        const decoded = jwt.verify(token,'jwtsecret')
        req.user = decoded.user
        
        //2. ตรวจสอบ role ว่าเป็น Admin หรือไม่
        if (req.user.role==='admin') {
            next()
          } else {
            res.status(403).json({ message: 'Access denied' });
        } 

    }catch (err){
        console.log(err)
        res.send('Token Invalid').status(500)
    } 
  }