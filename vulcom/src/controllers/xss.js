import conn from '../database/db.js'

const controller = {}

controller.index = async function(req, res) {
  try {
    const sql = 'select * from comments order by date_time desc'

    const result = await conn.query(sql)

    res.render('xss/comments', {
      title: 'XSS (Cross-Site Scripting)',
      error: '',
      comments: result.rows
    })
  }
  catch(error) {
    console.error(error)
    res.render('xss/comments', {
      title: 'XSS (Cross-Site Scripting)',
      error: error.message,
      comments: []
    })
  }
}

controller.create = async function(req, res) {
  try {
    // Sanitização simples da entrada do usuário para evitar XSS
    // Troca todas as ocorrências de '<' por '&lt;'
    // req.body.comment = req.body.comment.replaceAll('<', '&lt;')

    let sql = 'insert into comments (comment) values ($1)'
    
    // req.sanitize é fornecido pelo pacote express-sanitizer e configurado no arquivo app.js
    const params = [req.sanitize(req.body.comment)]

    await conn.query(sql, params)

    await controller.index(req, res)
  }
  catch(error) {
    console.error(error)
    res.render('xss/comments', {
      title: 'XSS (Cross-Site Scripting)',
      error: error.message,
      comments: []
    })
  }
}

export default controller
