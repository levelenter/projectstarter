const login = (req, res, next) => {
  try {
      const { mail, password } = req.body
      let user = {
          mail,
          password
      }

      if (mail === "admin") {
          if (password === "admin") {
              res.locals.user = user
              next()
          } else {
              res.status(400).json({
                  error: 'Incorrect username or password'
              })
          }
      } else {
          res.status(400).json({
              error: 'Incorrect username or password'
          })
      }
  } catch (error) {
      res.status(500).json({ error })
  }
}

export default login