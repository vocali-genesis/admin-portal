import MessageHandler from "@/core/message-handler";
import { GenesisReport } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { MedicalTranscription } from "@/core/module/services.types";
import { Seed } from "@/resources/tests/seed";
import { faker } from "@faker-js/faker";

const messageHandler = MessageHandler.get();

class MedicalTranscriptionAPI implements MedicalTranscription {
  constructor() {}
  private handleError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    messageHandler.handleError(errorMessage);
  }

  async transcribeAudio(): Promise<string> {
    return Promise.resolve(faker.lorem.paragraphs());
  }

  async processAudioAndGenerateReport(): Promise<GenesisReport | null> {
    const report = Seed.new().report().promise();
    return report;
  }
}

GlobalCore.manager.service("medical-api", new MedicalTranscriptionAPI());
