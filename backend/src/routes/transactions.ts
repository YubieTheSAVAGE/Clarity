import { Router } from "express";
import { Prisma } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import {
  validateTransactionType,
  validateAmount,
} from "../lib/validate.js";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const userId = req.userId!;
    const { type, category, startDate, endDate } = req.query;

    const where: Prisma.TransactionWhereInput = { userId };

    if (type === "income" || type === "expense") {
      where.type = type;
    }
    if (typeof category === "string" && category.trim()) {
      where.category = { contains: category.trim(), mode: "insensitive" };
    }
    const start = typeof startDate === "string" && startDate ? new Date(startDate) : null;
    const end = typeof endDate === "string" && endDate ? new Date(endDate) : null;
    if (start && !Number.isNaN(start.getTime()) && end && !Number.isNaN(end.getTime())) {
      where.date = { gte: start, lte: end };
    } else if (start && !Number.isNaN(start.getTime())) {
      where.date = { gte: start };
    } else if (end && !Number.isNaN(end.getTime())) {
      where.date = { lte: end };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const out = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
      date: t.date.toISOString(),
      description: t.description,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    res.json(out);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = req.userId!;
    const { type, amount, category, date, description } = req.body;

    const typeErr = validateTransactionType(type);
    if (typeErr) return res.status(400).json({ error: typeErr });

    const amt = validateAmount(amount);
    if (amt === null) return res.status(400).json({ error: "Invalid amount (must be a non-negative number)" });

    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ error: "Category is required" });
    }

    const d = date ? new Date(date) : new Date();
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const tx = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: amt,
        category: category.trim(),
        date: d,
        description: typeof description === "string" ? description.trim() || null : null,
      },
    });

    res.status(201).json({
      id: tx.id,
      type: tx.type,
      amount: Number(tx.amount),
      category: tx.category,
      date: tx.date.toISOString(),
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { type, amount, category, date, description } = req.body;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: "Transaction not found" });

    const data: Prisma.TransactionUpdateInput = {};

    if (type !== undefined) {
      const typeErr = validateTransactionType(type);
      if (typeErr) return res.status(400).json({ error: typeErr });
      data.type = type;
    }
    if (amount !== undefined) {
      const amt = validateAmount(amount);
      if (amt === null) return res.status(400).json({ error: "Invalid amount" });
      data.amount = amt;
    }
    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({ error: "Category cannot be empty" });
      }
      data.category = category.trim();
    }
    if (date !== undefined) {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return res.status(400).json({ error: "Invalid date" });
      data.date = d;
    }
    if (description !== undefined) {
      data.description = typeof description === "string" ? (description.trim() || null) : null;
    }

    const tx = await prisma.transaction.update({
      where: { id },
      data,
    });

    res.json({
      id: tx.id,
      type: tx.type,
      amount: Number(tx.amount),
      category: tx.category,
      date: tx.date.toISOString(),
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: "Transaction not found" });

    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
