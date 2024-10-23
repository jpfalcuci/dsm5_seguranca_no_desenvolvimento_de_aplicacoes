import prisma from '../database/client.js'

const controller = {}

controller.retrieve = async function(req, res) {
    try {

        const users = await prisma.users.findMany()

        res.render('users/list', {
            title: 'Listagem de usuários',
            users,
            message: '',
            error: false
        })

    }
    catch(error) {
        console.log(error)
        res.render('users/list', {
            title: 'Listagem de usuários',
            users: [],
            message: 'Erro no acesso ao banco de dados',
            error: true
        })
    }
}

controller.newUser = function(req, res) {
    res.render('users/form', {
        title: 'Cadastrar novo usuário',
        message: '',
        error: false,
        user: {}
    })
}

export default controller
