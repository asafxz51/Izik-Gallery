module.exports = func => {
 return (req, res, next) => {
  func(req, res, next).catch(err => {
   if (err.toString().includes("CastError")) {
    req.flash("error", "Couldn't find that page.");
    res.redirect("/gallery");
   } else {
    next(err);
   }
  });
 };
};