import "dotenv/config";
import express from "express";
import clientesRoutes from "./routes/clientes.routes.js";
import barbeirosRoutes from "./routes/barbeiros.routes.js";
import servicosRoutes from "./routes/servicos.routes.js";
import agendamentosRoutes from "./routes/agendamentos.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensagem: "API do Sistema Barbearia funcionando!",
  });
});

app.use("/clientes", clientesRoutes);
app.use("/barbeiros", barbeirosRoutes);
app.use("/servicos", servicosRoutes);
app.use("/agendamentos", agendamentosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
