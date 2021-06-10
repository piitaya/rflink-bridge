import fastify from "fastify";
import controller from "./controller";

const PORT = Number(process.env.PORT) || 9443;
const app = fastify();

app.register(controller);
app.listen(PORT, '0.0.0.0');

console.log(`🚀 RF Link bridge running on port ${PORT}`);
