import { FastifyInstance } from "fastify";
import RflinkSerialPort from "./rflink-serial-port";

const DEVICE_PATH = process.env.DEVICE_PATH;

const controller = async (fastify: FastifyInstance) => {
  if (!DEVICE_PATH) throw new Error(`No device path set`);

  const rflink = new RflinkSerialPort(DEVICE_PATH);

  rflink.on("data", (data) => {
    console.log("[data]", data);
  });
  rflink.on("open", () => console.log("[connection] opened"));
  rflink.on("close", () => console.log("[connection] closed"));

  fastify.get<{
    Querystring: { command: string };
  }>("/send_command", async (request, reply) => {
    const { command } = request.query;

    try {
      await rflink.write(command);

      reply.send({
        message: "Command sent",
      });
    } catch (err) {
      reply.status(400).send({
        err: err.message,
      });
    }
  });
};

export default controller;
