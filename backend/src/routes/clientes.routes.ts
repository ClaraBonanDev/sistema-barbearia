import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/client.js";

const router = Router();

router.get("/", async (_req, res) => {
  const clientes = await prisma.cliente.findMany();

  res.json(clientes);
});

router.post("/", async (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({
      erro: "O nome é obrigatório.",
    });
  }

  if (!telefone || typeof telefone !== "string" || !telefone.trim()) {
    return res.status(400).json({
      erro: "O telefone é obrigatório.",
    });
  }

  if (
    email !== undefined &&
    email !== null &&
    (typeof email !== "string" || !email.includes("@"))
  ) {
    return res.status(400).json({
      erro: "O e-mail informado é inválido.",
    });
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email?.trim() || null,
      },
    });

    return res.status(201).json(cliente);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        erro: "Já existe um cliente com este e-mail.",
      });
    }

    console.error(error);

    return res.status(500).json({
      erro: "Não foi possível cadastrar o cliente.",
    });
  }
});

export default router;
