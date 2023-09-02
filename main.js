import express from 'express'
import file from './users.json' assert { type : 'json'}
import promo from './promo.json' assert { type : 'json'}
import * as fs from 'fs'

const PORT = 8888
const app = express()

app.use(express.json())
app.post('/reg', (req,res) => {
    var User = req.body
    var free = true
    var users = file
    User.id=users.accounts.length
    console.log("Try regestration")
    console.log(User)
    for (var i = 0;i<users.accounts.length;i++){
        if(User.login == users.accounts[i].login){
            free=false
            break
        }
    }
    if(free){
        users.accounts.push(User)
        var users1=JSON.stringify(users)
        fs.writeFile('users.json',users1,(err)=>{
            if(err) throw err;
        }
        )
        res.status(200).json('Confirm')
        console.log('Confirm')
    }
    else{
        res.status(200).json('Login use!')
        console.log('Login use!')
    }
})
app.get('/load',(req,res)=>{
    var users = file
    var log = false
    console.log("Try inter ")
    console.log(req.query)
    for(var i = 0;i<users.accounts.length;i++){
        if(req.query.login==users.accounts[i].login&req.query.password==users.accounts[i].password){
            console.log("Successful!")
            res.status(200).json(users.accounts[i])
            log = true
            break
        }
    }
    if(log == false){
        console.log("Error!")
        res.status(200).json("Wrong log or pas!")
    }
})
app.post('/save',(req,res)=>{
    var User = req.body
    var users = file
    console.log('Try save:')
    console.log(User)
    users.accounts[User.id].coins=User.coins
    users.accounts[User.id].skinsUnlock=User.skinsUnlock
    var users1=JSON.stringify(users)
    fs.writeFile('users.json',users1,(err)=>{
        if(err) {
            console.log('Error!')
            res.status(200).json("Error!")
            throw err;
        }
        else{
            console.log('Successfull')
            res.status(200).json("Successfull!")
        }
    })
})
app.get('/promo',(req,res)=>{
    var promocodes = promo
    var users = file
    var act=false
    var id=req.query.id
    console.log('Try activate promo on account')
    console.log(req.query)
    for(var i = 0; i<promocodes.promocodes.length;i++){
        if(req.query.promo==promocodes.promocodes[i].promo){
            if(promocodes.promocodes[i].type=='coin'){
                console.log('Successfull!Give coins.')
                users.accounts[id].coins+=promocodes.promocodes[i].reward
            }
            else if(promocodes.promocodes[i].type=='skin'){
                users.accounts[id].skinsUnlock.push(promocodes.promocodes[i].reward)
                console.log('Successfull!Give skin.')
            }
            promocodes.promocodes.splice(i,1)
            act=true
            res.status(200).json("Successfull!")
            var users1=JSON.stringify(users)
            fs.writeFile('users.json',users1,(err)=>{
                if(err) {
                    throw err;
                }
            })
            var promo1 = JSON.stringify(promo)
            fs.writeFile('promo.json',promo1,(err)=>{
                if(err) throw err;
            })
        }
    }
    if(act==false){
        console.log('Wrong promocode.')
        res.status(200).json("Wrong promocode.")
    }
})
app.listen(PORT,()=> console.log("SERVER STARTED ON PORT "+PORT))
