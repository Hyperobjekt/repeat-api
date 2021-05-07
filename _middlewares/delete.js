module.exports = (req, res, next) => {
    req.body = { collection: collection, documentId: req.params._id, tags: ['READY_TO_DELETE'] };
    req.locals = {}
    collection = 'trash';
    next()
  }