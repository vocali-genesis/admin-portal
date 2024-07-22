import messageHandler from "@/core/message-handler";
import config from "@/resources/utils/config";

class MedicalTranscriptionAPI {
  private baseUrl: string = config.MEDICAL_TRANSCRIPTION_API_URL as string;

  private handleError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    messageHandler.handleError(errorMessage);
  }

  private async handleResponse(response: Response): Promise<string> {
    if (!response.ok) {
      const errorData = await response.json();
      this.handleError(errorData.detail[0]?.msg || "API request failed");
      return "";
    }
    return await response.text();
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

    return this.handleResponse(response);
  }

  async generateReport(
    transcription: string,
    template?: string,
    language?: string,
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

    return this.handleResponse(response);
  }

  async processAudioAndGenerateReport(
    audioFile: File,
    template?: string,
    language?: string,
  ): Promise<{ report: string; transcription: string } | null> {
    const transcription: string = await this.transcribeAudio(audioFile);
    if (!transcription) return null;

    const report: string = await this.generateReport(
      transcription,
      template,
      language,
    );
    return { report, transcription };
  }
}

export default new MedicalTranscriptionAPI();
