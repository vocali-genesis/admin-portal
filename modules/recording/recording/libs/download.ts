import { PDFDocument, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import MessageHandler from "@/core/message-handler";

const messagehandler = MessageHandler.get();

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
      messagehandler.handleError((error as Error).message);
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

    const downloadPDF = await pdfDoc.save();
    saveAs(
      new Blob([downloadPDF], { type: "application/pdf" }),
      "transcription.pdf",
    );
  }

  static async downloadReport(content: Record<string, string>) {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = height - 50;
    const fontSize = 12;
    const headerFontSize = 14;
    const lineHeight = fontSize * 1.25;
    const headerSpacing = fontSize * 0.75; // Adjust spacing below headers

    const drawText = (text: string, options: any) => {
      if (y < 50) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
      }
      page.drawText(text, { ...options, y });
      y -= options.spacing || lineHeight;
    };

    const renderObject = (obj: Record<string, string>, level: number = 0) => {
      Object.entries(obj).forEach(([key, val], index, array) => {
        const indent = 50 + level * 20;
        if (level === 0) {
          drawText(key, {
            x: indent,
            size: headerFontSize,
            font: boldFont,
            spacing: lineHeight + headerSpacing, // Add space under headers
          });
        } else {
          drawText(`${key}:`, { x: indent, size: fontSize, font });
        }

        if (typeof val === "object" && val !== null) {
          renderObject(val, level + 1);
        } else {
          drawText(String(val), { x: indent + 10, size: fontSize, font });
        }

        if (level === 0) {
          y -= lineHeight;

          if (y < 50) {
            page = pdfDoc.addPage([600, 800]);
            y = height - 50;
          }
        }
      });
    };

    renderObject(content);
    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "report.pdf");
  }
}

export default Download;
