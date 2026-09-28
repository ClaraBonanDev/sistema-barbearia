import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const servicos = await prisma.servico.findMany();

  res.json(servicos);
});

router.post("/", async (req, res) => {
  const { nome, descricao, preco, duracaoMin, ativo } = req.body;

  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({
      erro: "O nome é obrigatório.",
    });
  }

  if (preco === undefined || preco === null || isNaN(Number(preco))) {
    return res.status(400).json({
      erro: "O preço é obrigatório e deve ser um número.",
    });
  }

  if (
    duracaoMin === undefined ||
    duracaoMin === null ||
    !Number.isInteger(Number(duracaoMin)) ||
    Number(duracaoMin) <= 0
  ) {
    return res.status(400).json({
      erro: "A duração deve ser um número inteiro maior que zero.",
    });
  }

  if (ativo !== undefined && typeof ativo !== "boolean") {
    return res.status(400).json({
      erro: "O campo ativo deve ser verdadeiro ou falso.",
    });
  }

  try {
    const servico = await prisma.servico.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        preco: Number(preco),
        duracaoMin: Number(duracaoMin),
        ativo: ativo ?? true,
      },
    });

    return res.status(201).json(servico);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Não foi possível cadastrar o serviço.",
    });
  }
});

export default router;
