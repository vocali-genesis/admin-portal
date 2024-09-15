import MessageHandler from "@/core/message-handler";
import { GenesisReport, GenesisTemplate } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { MedicalTranscription } from "@/core/module/services.types";
import config from "@/resources/utils/config";

const messageHandler = MessageHandler.get();

class MedicalTranscriptionAPI implements MedicalTranscription {
  private baseUrl: string = config.TRANSCRIPTION_API as string;

  constructor() {
    if (!this.baseUrl) {
      throw new Error("NEXT_PUBLIC_TRANSCRIPTION_API not configured properly");
    }
  }
  private handleError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    messageHandler.handleError(errorMessage);
  }

  private async handleResponse<T>(
    response: Response | null
  ): Promise<T | null> {
    if (!response) {
      return null;
    }
    if (!response.ok) {
      const errorData = (await response.json()) as {
        detail: Array<{ msg: string }>;
      };
      this.handleError(errorData.detail[0]?.msg || "API request failed");
      return null;
    }
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async transcribeAudio(
    audioFile: File
  ): Promise<GenesisReport["transcription"]> {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    try {
      const response = await fetch(`${this.baseUrl}/api/transcribe_file`, {
        method: "POST",
        body: formData,
      });
      const result = await this.handleResponse<GenesisReport["transcription"]>(
        response
      );
      return result || [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async generateReport(
    transcription: GenesisReport["transcription"],
    template?: GenesisTemplate,
    language?: string
  ): Promise<GenesisReport["report"]> {
    const response = await fetch(`${this.baseUrl}/api/generate_report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        template,
        language,
      }),
    }).catch((error) => {
      this.handleError(error);
      return new Response();
    });
    const result = await this.handleResponse<GenesisReport["report"]>(response);
    return result || {};
  }

  async processAudioAndGenerateReport(
    audioFile: File,
    template?: GenesisTemplate,
    language?: string
  ): Promise<GenesisReport | null> {
    const transcriptionStart = Date.now();
    const transcription = await this.transcribeAudio(audioFile);
    if (!transcription.length) {
      return null;
    }
    const transcriptionTime = Date.now() - transcriptionStart;
    const reportStart = Date.now();
    const report = await this.generateReport(transcription, template, language);
    const reportTime = Date.now() - reportStart;
    return {
      report,
      transcription,
      time: {
        transcription: transcriptionTime,
        report: reportTime,
      },
    };
  }
}

GlobalCore.manager.service("medical-api", new MedicalTranscriptionAPI());
