import { GenesisReport } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { MedicalTranscription } from "@/core/module/services.types";
import { Seed } from "@/resources/tests/seed";
import { faker } from "@faker-js/faker";

class MedicalTranscriptionAPI implements MedicalTranscription {
  constructor() {}

  async transcribeAudio(): Promise<GenesisReport["transcription"]> {
    return Promise.resolve(
      faker.lorem.paragraphs({ min: 1, max: 5 }, "\n").split("\n")
    );
  }

  async processAudioAndGenerateReport(): Promise<GenesisReport | null> {
    const report = Seed.new().report().promise();
    return report;
  }
}

GlobalCore.manager.service("medical-api", new MedicalTranscriptionAPI());
