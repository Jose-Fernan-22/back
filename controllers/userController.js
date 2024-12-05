const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/global')

exports.crearUsuario = async (req, res) => {

    try{

        const { username, email, password } = req.body
        const user = new User(
            {
                username,
                email,
                password
            }
        )

        user.password = await user.encryptPassword(password)
        await user.save()

        const token = jwt.sign({
            id: user._id}, config.secret, {expiresIn: 60 * 60 * 24})

           return res.json({
                auth:true,
                token: token
            })

    }catch (error) {
        console.error('Error:', error); // Imprime más detalles del error
        res.status(500).send('Hubo un error inesperado');
    }
    
}

exports.obtenerUsuario =  async (req, res) => {

    try{

        const { email, password } = req.body
        const user = await user.findOne({ email: email })

        if(!user){
            return res.status(404).send('El usuario no existe')
        }

        const validPassword = await User.decryptPassword(user.password)

        if(password === validPassword){

            const token = jwt.sign({id: user._id}. config.secret, {expiresIn: 60 * 60 * 24})
            return res.json({ auth: true, token: token })

        }else{
            return res.status(401).json({
                auth: false,
                token: null
            })

        }

    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error inesperado')
    }
}