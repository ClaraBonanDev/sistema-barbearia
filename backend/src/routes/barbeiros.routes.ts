import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/client.js";

const router = Router();

router.get("/", async (_req, res) => {
  const barbeiros = await prisma.barbeiro.findMany();

  res.json(barbeiros);
});

router.post("/", async (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({
      erro: "O nome é obrigatório.",
    });
  }

  try {
    const barbeiro = await prisma.barbeiro.create({
      data: {
        nome: nome.trim(),
        telefone: telefone?.trim() || null,
        email: email?.trim() || null,
      },
    });

    return res.status(201).json(barbeiro);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        erro: "Já existe um barbeiro com este e-mail.",
      });
    }

    console.error(error);

    return res.status(500).json({
      erro: "Não foi possível cadastrar o barbeiro.",
    });
  }
});

export default router;
