import MessageHandler from "@/core/message-handler";
import { GenesisReport } from "@/core/module/core.types";
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

  private async handleResponse<T>(response: Response): Promise<T | null> {
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

  async transcribeAudio(audioFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("audio_file", audioFile);

    const response = await fetch(`${this.baseUrl}/api/transcribe_file`, {
      method: "POST",
      body: formData,
    }).catch((error) => {
      this.handleError(error);
      return new Response();
    });

    const result = (await this.handleResponse<string>(response)) || "";
    return result;
  }

  async generateReport(
    transcription: string,
    template?: string,
    language?: string
  ): Promise<string> {
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
    const result = await this.handleResponse<string>(response);
    return result || "";
  }

  async processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string
  ): Promise<GenesisReport | null> {
    const transcriptionStart = Date.now();
    const transcription: string = await this.transcribeAudio(audioFile);
    const transcriptionTime = Date.now() - transcriptionStart;
    if (!transcription) return null;
    const reportStart = Date.now();
    const report: string = await this.generateReport(
      transcription,
      template,
      language
    );
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
