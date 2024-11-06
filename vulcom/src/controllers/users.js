import prisma from '../database/client.js'
import bcrypt from 'bcrypt'

const controller = {}

// Insere ou atualiza, dependendo se os dados enviados têm o não o valor do campo id
controller.upsert = async function(req, res) {
  try {

    // Apaga os pseudocampos confirm_email e confirm_password
    if(req.body.confirm_email) delete req.body.confirm_email
    if(req.body.confirm_password) delete req.body.confirm_password

    // Converte o valor do campo is_admin para boolean
    req.body.is_admin = (req.body.is_admin === 'on')
    
    // Se houver campo password no body da requisição, encripta seu valor com bcrypt, usando 12 passos
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }

    let message

    // Se existe um valor válido de id em req.body, faremos a atualização
    if(req.body.id) {
      await prisma.users.update({
        where: { id: Number(req.body.id) },
        data: req.body
      })
      message = 'Usuário atualizado com sucesso.'
    }
    // Senão, será feita uma inserção
    else {
      // Apaga o pseudocampo do id
      delete req.body.id
      await prisma.users.create({ data: req.body })
      message = 'Usuário cadastrado com sucesso' 
    }

    res.render('users/form', {
      title: 'Cadastrar novo usuário',
      message,
      error: false,
      user: {}
    })
    
  }
  catch(error) {
    console.log(error)
    res.render('users/form', {
      title: 'Cadastrar novo usuário',
      message: 'ERRO: ' + error.message,
      error: true,
      user: req.body
    })
  }
}

controller.retrieve = async function(req, res) {
    try {

        const users = await prisma.users.findMany({
          omit: { password: true } // O campo será omitido do resultado
        })

        console.log({users})

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

controller.editUser = async function(req, res) {
  try {
    // Busca o usuário a ser editado
    const result = await prisma.users.findUnique({
      where: { id: Number(req.params.id) },
      omit: { password: true } // O campo será omitido do resultado
    })

    res.render('users/form', {
      title: 'Editar usuário',
      message: '',
      error: false,
      user: result
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

export default controller
