exports.get500 = (req, res, next) => {
  res.status(500).render('errors/500', {
    isAuthenticated: req.session.isLoggedIn
  })
}