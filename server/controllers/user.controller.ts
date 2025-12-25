import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ success: true, data: users });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json({ success: true, data: user });
};
