import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      cliente: true,
      barbeiro: true,
      servico: true,
    },
  });

  res.json(agendamentos);
});

router.post("/", async (req, res) => {
  const { dataHora, status, observacao, clienteId, barbeiroId, servicoId } =
    req.body;

  if (!dataHora) {
    return res.status(400).json({
      erro: "A data e hora são obrigatórias.",
    });
  }

  const data = new Date(dataHora);

  if (isNaN(data.getTime())) {
    return res.status(400).json({
      erro: "A data e hora informadas são inválidas.",
    });
  }

  if (!clienteId || !Number.isInteger(Number(clienteId))) {
    return res.status(400).json({
      erro: "O cliente é obrigatório.",
    });
  }

  if (!barbeiroId || !Number.isInteger(Number(barbeiroId))) {
    return res.status(400).json({
      erro: "O barbeiro é obrigatório.",
    });
  }

  if (!servicoId || !Number.isInteger(Number(servicoId))) {
    return res.status(400).json({
      erro: "O serviço é obrigatório.",
    });
  }

  const cliente = await prisma.cliente.findUnique({
  where: {
    id: Number(clienteId),
  },
});

if (!cliente) {
  return res.status(404).json({
    erro: "Cliente não encontrado.",
  });
}

const barbeiro = await prisma.barbeiro.findUnique({
  where: {
    id: Number(barbeiroId),
  },
});

if (!barbeiro) {
  return res.status(404).json({
    erro: "Barbeiro não encontrado.",
  });
}

const servico = await prisma.servico.findUnique({
  where: {
    id: Number(servicoId),
  },
});

if (!servico) {
  return res.status(404).json({
    erro: "Serviço não encontrado.",
  });
}

  try {
    const agendamento = await prisma.agendamento.create({
      data: {
        dataHora: data,
        status: status || "AGENDADO",
        observacao: observacao?.trim() || null,
        clienteId: Number(clienteId),
        barbeiroId: Number(barbeiroId),
        servicoId: Number(servicoId),
      },
      include: {
        cliente: true,
        barbeiro: true,
        servico: true,
      },
    });

    return res.status(201).json(agendamento);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Não foi possível criar o agendamento.",
    });
  }
});

export default router;

