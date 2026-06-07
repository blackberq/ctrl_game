import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  Logger.log(`ctrl_game server listening on http://localhost:${port}`, "Bootstrap");
}

void bootstrap();
