import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
router.use(authMiddleware);

router.get("/summary", async (req, res, next) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    const where: { userId: string; date?: { gte?: Date; lte?: Date } } = { userId };
    const start = typeof startDate === "string" && startDate ? new Date(startDate) : null;
    const end = typeof endDate === "string" && endDate ? new Date(endDate) : null;
    if (start && !Number.isNaN(start.getTime()) && end && !Number.isNaN(end.getTime())) {
      where.date = { gte: start, lte: end };
    } else if (start && !Number.isNaN(start.getTime())) {
      where.date = { gte: start };
    } else if (end && !Number.isNaN(end.getTime())) {
      where.date = { lte: end };
    }

    const transactions = await prisma.transaction.findMany({ where });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    for (const t of transactions) {
      const amt = Number(t.amount);
      if (t.type === "income") totalIncome += amt;
      else {
        totalExpense += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
      }
    }

    const expenseByCategory = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));

    res.json({
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      expenseByCategory,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
