module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Precisa estar logado para acessar este recurso");
      res.redirect("/auth/login");
    }
  }
};
