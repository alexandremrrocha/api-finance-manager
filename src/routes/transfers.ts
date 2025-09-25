import express from "express";

module.exports = (app: any) => {
  const router = express.Router();

  router.get('/', async (req: any, res, next) => {
    try {
      const result = await app.services.transfer.find({ user_id: req.user.id });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req: any, res, next) => {
    try {
      const transfer = { ...req.body, user_id: req.user.id };
      const result = await app.services.transfer.save(transfer);
      return res.status(201).json(result[0]);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
