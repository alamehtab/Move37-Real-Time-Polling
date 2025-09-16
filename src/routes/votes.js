const express = require('express');

module.exports = (prisma, io) => {
  const router = express.Router();

  // creating a vote
  router.post('/', async (req, res) => {
    try {
      const { userId, pollId, pollOptionId } = req.body;
      if (!userId || !pollId || !pollOptionId) {
        return res.status(400).json({ error: 'userId, pollId and pollOptionId required' });
      }

      // match option is included in poll
      const option = await prisma.pollOption.findUnique({ where: { id: pollOptionId } });
      if (!option || option.pollId !== pollId) {
        return res.status(400).json({ error: 'option does not belong to poll' });
      }

      // check uniqueness in user; he/she should not vote again for the same poll
      const existing = await prisma.vote.findUnique({
        where: {
          userId_pollId: {
            userId: Number(userId),
            pollId: Number(pollId)
          }
        }
      }).catch(() => null);

      if (existing) {
        return res.status(409).json({ error: 'user already voted for this poll' });
      }

      const vote = await prisma.vote.create({
        data: {
          userId: Number(userId),
          pollId: Number(pollId),
          pollOptionId: Number(pollOptionId)
        }
      });

      // calculating updated counts for the poll
      const poll = await prisma.poll.findUnique({
        where: { id: Number(pollId) },
        include: {
          options: {
            include: {
              _count: { select: { votes: true } }
            }
          }
        }
      });

      const counts = poll.options.map(o => ({ id: o.id, text: o.text, votes: o._count?.votes ?? 0 }));

      // set to votes table
      const room = `poll:${pollId}`;
      io.to(room).emit('vote_update', { pollId: Number(pollId), options: counts });

      res.status(201).json({ voteId: vote.id, pollId: Number(pollId), pollOptionId: Number(pollOptionId) });
    } catch (err) {
      console.error(err);
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'unique constraint failure' });
      }
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
};
