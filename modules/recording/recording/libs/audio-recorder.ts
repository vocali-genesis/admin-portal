import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;

  async startRecording(deviceId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      this.mediaRecorder.start();
    } catch (error) {
      messageHandler.handleError(
        `Error starting recording: ${(error as Error).message}`,
      );
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
    } else {
      messageHandler.handleError(
        "Cannot pause recording: MediaRecorder is not in recording state",
      );
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
    } else {
      messageHandler.handleError(
        "Cannot resume recording: MediaRecorder is not in paused state",
      );
    }
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          resolve(audioUrl);
        };
        this.mediaRecorder.stop();
      } else {
        messageHandler.handleError("MediaRecorder not initialized");
        resolve("");
      }
    });
  }

  dispose() {
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        messageHandler.handleError(
          `Error closing AudioContext: ${error.message}`,
        );
      });
      this.audioContext = null;
    }
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  getSourceNode(): MediaStreamAudioSourceNode | null {
    return this.sourceNode;
  }
}
