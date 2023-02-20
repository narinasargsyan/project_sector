export function canEditProfile(req, res, next) {
  try {
    if (req.params.id !== req.payload.id) {
      res.status(406).send("Invalid user Id provided");
      return;
    }
    return next();
  } catch (e) {
    next(e);
  }
}
