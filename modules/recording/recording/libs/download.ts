import { PDFDocument, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

class Download {

  static async downloadAudio(audioUrl: string) {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `audio-${new Date().toLocaleDateString()}.mp3`;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download audio file:", error);
      throw error;
    }
  }
  
  static async downloadTranscription(content: string[]) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    let y = height - 50;
    const fontSize = 12;
    const lineHeight = fontSize * 1.5;

    for (const line of content) {
      if (y < 50) {
        // Correctly add a new page to the pdfDoc
        pdfDoc.addPage();
        y = height - 50;
      }
      page.drawText(line, { x: 50, y: y, size: fontSize });
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    saveAs(
      new Blob([pdfBytes], { type: "application/pdf" }),
      "transcription.pdf",
    );
  }

  static async downloadReport(content: object) {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { height, width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = height - 50;
    const fontSize = 12;
    const headerFontSize = 16;
    const lineHeight = fontSize * 1.5;

    const drawText = (text: string, options: any) => {
      if (y < 50) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
      }
      page.drawText(text, { ...options, y });
      y -= lineHeight;
    };

    const renderObject = (obj: any, level: number = 0) => {
      Object.entries(obj).forEach(([key, val]) => {
        const indent = 50 + level * 20;
        if (level === 0) {
          drawText(key, { x: indent, size: headerFontSize, font: boldFont });
          y -= lineHeight; // Extra space after header
        } else {
          drawText(`${key}:`, { x: indent, size: fontSize, font });
        }

        if (typeof val === "object" && val !== null) {
          renderObject(val, level + 1);
        } else {
          drawText(String(val), { x: indent + 10, size: fontSize, font });
        }
      });
    };

    renderObject(content);

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "report.pdf");
  }
}

export default Download;
