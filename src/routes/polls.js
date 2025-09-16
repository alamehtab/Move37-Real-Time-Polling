const express = require('express');

module.exports = (prisma, io) => {
  const router = express.Router();

  // creating polls to vote on
  router.post('/', async (req, res) => {
    try {
      const { question, creatorId, isPublished = false, options } = req.body;
      if (!question || !creatorId || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'question, creatorId and at least 2 options required' });
      }

      const poll = await prisma.poll.create({
        data: {
          question,
          isPublished,
          creatorId,
          options: {
            create: options.map(text => ({ text }))
          }
        },
        include: { options: true }
      });

      res.status(201).json(poll);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

    // getting polls by id
  router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
      const poll = await prisma.poll.findUnique({
        where: { id },
        include: {
          options: {
            include: {
              _count: {
                select: { votes: true }
              }
            }
          },
          creator: { select: { id: true, name: true, email: true } }
        }
      });
      if (!poll) return res.status(404).json({ error: 'not found' });

      const optionsWithCounts = poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: opt._count?.votes ?? 0
      }));

      res.json({
        id: poll.id,
        question: poll.question,
        isPublished: poll.isPublished,
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
        creator: poll.creator,
        options: optionsWithCounts
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // getting all polls
  router.get('/', async (req, res) => {
    try {
      const polls = await prisma.poll.findMany({
        take: 50,
        include: { creator: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(polls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
