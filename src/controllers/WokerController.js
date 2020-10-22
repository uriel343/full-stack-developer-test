const bcrypt = require("bcrypt");
const Worker = require("../models/worker");
const jwt = require("jsonwebtoken");

function register(req, res) {
    let params = req.body;
    let worker = new Worker()

    if(params.name && params.email && params.password){
      worker.name = params.name,
      worker.email = params.email,
      worker.password = bcrypt.hashSync(params.password, 10)

    Worker.findOne({ email: worker.email },(err, workerExisting)=>{
      if(err) return res.status(500).json({ message: 'Internal server error, please try again' })
      if(workerExisting) return res.status(400).json({ message: 'Email in use, please try with another' })

      const workerRegistered = worker.save();
      if(!workerRegistered) throw new Error('Something went wrong saving the Worker')
      return res.status(200).json(workerRegistered)
    })
    }else{
      return res.status(400).json({ message: 'Fill all the blanks' })
    }
      
  }
  
function login(req, res) {
    let params = req.body;
  
    Worker.findOne({ email: params.email }, (err, worker) => {
      if (err) return res.status(500).json({ message: 'Internal server error, please try again' })
      if (!worker) return res.status(401).json({ message: 'User not found, invalid credentials, please try again' })
      if (!bcrypt.compareSync(params.password, worker.password)) return res.status(401).json({ message: 'password incorrect, please write the correct password' })
      let token = jwt.sign({ workerId: worker._id },'secretkey')
      return res.status(200).json({ message: 'Login successful', token: token })
    });
  }

function auth(req, res){
  let token = req.headers.token
  jwt.verify(token, 'secretkey', (err, decoded)=>{
    if (err) return res.status(403).json({ message: 'Unauthorized' })
    Worker.findOne({_id: decoded.workerId}, (err, workerAuth)=>{
      if(err) return console.log(err)
      return res.status(200).json({
        message: 'Worker Authenticated',
        worker:{
          email: workerAuth.email,
          name: workerAuth.name
        }
      })
    })
  })
};
  
module.exports = {
    register,
    login,
    auth
}