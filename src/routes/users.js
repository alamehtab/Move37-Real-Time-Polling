const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (prisma) => {
  const router = express.Router();

  // creating a  user
  router.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'email already exists' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, passwordHash }
      });
      const { passwordHash: _, ...publicUser } = user;
      res.status(201).json(publicUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // getting a user by id
  router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, createdAt: true }
      });
      if (!user) return res.status(404).json({ error: 'not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
