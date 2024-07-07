module.exports = func => {
 return (req, res, next) => {
  func(req, res, next).catch(err => {
   console.error('Error in catchAsync:', err); 
   next(err); 
  });
 };
};
