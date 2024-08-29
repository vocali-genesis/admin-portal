import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent, GlobalCore } from "@/core/module/module.types";
import "./index";
import Download from "./libs/download";
import "@/services/auth/auth-mock.service";
import "@/services/genesis/transcription-mock.service";
import "@/services/templates/templates-mock.service";
import { MedicalTranscription } from "@/core/module/services.types";

import { faker } from "@faker-js/faker";
import {
  FetchMock,
  MediaDevicesMock,
  RouterMock,
  ToastMock,
} from "@/jest-setup";
import MessageHandler from "@/core/message-handler";
import React, { act } from "react";
import {
  getComponent,
  mockDownload,
  setRouteQuery,
} from "@/resources/tests/test.utils";
import { Seed } from "@/resources/tests/seed";
import { GenesisReport } from "@/core/module/core.types";

describe("===== RECORDING LOGIN =====", () => {
  let genesisService: MedicalTranscription;

  const downloadAudioSpy = jest.fn();
  jest.spyOn(Download, "downloadAudio").mockImplementation(downloadAudioSpy);

  beforeAll(() => {
    genesisService = GlobalCore.manager.getComponent(
      "service",
      "medical-api",
    ) as MedicalTranscription;
  });

  describe("Dashboard Page", () => {
    const SampleMicrophone = {
      deviceId: faker.string.uuid(),
      label: "Jest Microphone",
      kind: "audioinput",
    };

    let Dashboard: CoreComponent;
    let mediaSpy: jest.SpyInstance<typeof MediaDevicesMock>;
    beforeAll(() => {
      Dashboard = getComponent("app", "dashboard");
      mediaSpy = jest.spyOn(MediaDevicesMock, "enumerateDevices");
      mediaSpy.mockReturnValue([SampleMicrophone]);
    });

    beforeEach(() => {});
    afterEach(() => {});
    it("Dashboard is Mounted", async () => {
      await act(() => render(<Dashboard />));

      expect(screen.getByTestId("record-button")).toBeInTheDocument();
      expect(screen.getByTestId("upload-recording")).toBeInTheDocument();
      expect(screen.queryByText("recording.stop")).not.toBeInTheDocument();
      screen.debug();
    });

    it("Can't record without permissions", async () => {
      mediaSpy.mockReturnValueOnce([]);
      await act(() => render(<Dashboard />));

      act(() => screen.getByTestId("record-button").click());

      expect(ToastMock.error).toHaveBeenCalledWith(
        "recording.permission-required",
      );
    });

    it("I can start and pause the recording", async () => {
      await act(() => render(<Dashboard />));

      await waitFor(() => screen.getByText("recording.click-to-start"));

      screen.getByTestId("record-button").click();

      await waitFor(() => screen.getByText("recording.click-to-pause"));

      screen.getByTestId("record-button").click();

      await waitFor(() => screen.getByText("recording.click-to-resume"));
    });

    it.todo("Audio is recorded between pauses");
    it.todo("Button audio changes according to the volume");

    it("Stop recording takes me to the preview page", async () => {
      const spy = jest.spyOn(RouterMock, "push");

      await act(() => render(<Dashboard />));

      await waitFor(() => screen.getByText("recording.click-to-start"));

      screen.getByTestId("record-button").click();

      await waitFor(() => screen.getByText("recording.click-to-pause"));

      const stop = screen.getByRole("button", { name: "recording.stop" });
      stop.click();

      await waitForElementToBeRemoved(() => screen.getByText("recording.stop"));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        pathname: "/app/recording",
        query: { audioUrl: "" },
      });
    });

    it("Upload an audio file", async () => {
      await act(() => render(<Dashboard />));
      const input = screen.getByTestId("upload-recording");

      await userEvent.upload(
        input,
        Seed.new().file({ name: "audio.mp3", type: "audio/mp3" }),
      );

      await waitFor(() => screen.getByText("audio.mp3"));
    });

    it("File error: Wrong format file", async () => {
      await act(() => render(<Dashboard />));
      const input = screen.getByTestId("upload-recording");

      await userEvent.upload(
        input,
        Seed.new().file({ name: "image.mp3", type: "image/mp3" }),
      );

      expect(screen.queryByText("image.png")).not.toBeInTheDocument();
    });

    it("File error: File too big", async () => {
      await act(() => render(<Dashboard />));
      const input = screen.getByTestId("upload-recording");

      const file = Seed.new().file({ name: "audio.mp3", type: "audio/mp3" });
      jest.spyOn(file, "size", "get").mockReturnValue(500 * 1024 * 1024);
      await userEvent.upload(input, file);

      expect(screen.queryByText("audio.mp3")).not.toBeInTheDocument();

      expect(ToastMock.error).toHaveBeenCalledWith("resources.file-too-large");
    });

    it("Select file and click on upload ", async () => {
      const spy = jest.spyOn(RouterMock, "push");

      await act(() => render(<Dashboard />));
      const input = screen.getByTestId("upload-recording");

      expect(screen.getByText("recording.upload-files")).toBeDisabled();
      await userEvent.upload(
        input,
        Seed.new().file({ name: "audio.png", type: "audio/png" }),
      );

      expect(screen.getByText("recording.upload-files")).not.toBeDisabled();
      screen.getByText("recording.upload-files").click();

      expect(spy).toHaveBeenCalledWith({
        pathname: "/app/recording",
        query: { audioUrl: "" },
      });
    });
  });

  describe("Recording Page", () => {
    let Recording: CoreComponent;
    let audioUrl: string;

    beforeAll(() => {
      Recording = getComponent("app", "recording");
      jest
        .spyOn(FetchMock, "blob")
        .mockResolvedValueOnce(
          Seed.new().file({ name: "audio.mp3", type: "audio/mp3" }),
        );
    });
    beforeEach(() => {
      audioUrl = faker.internet.url();
      setRouteQuery({ audioUrl });
    });
    afterEach(() => {});

    it("Recording page mounts", () => {
      render(<Recording />);
      expect(screen.findByTestId("audio-player"));
      expect(screen.findByTestId("submit-button"));
    });

    it("Click next we call the transcription api", async () => {
      // Mock API response
      const report = Seed.new().report().create();
      jest
        .spyOn(genesisService, "processAudioAndGenerateReport")
        .mockResolvedValue(report);

      await act(() => render(<Recording />));

      const submitButton = await screen.findByTestId("submit-button");

      act(() => submitButton.click());
      await waitFor(() => {
        expect(RouterMock.push).toHaveBeenCalledWith({
          pathname: "/app/report",
          query: {
            audioUrl: audioUrl,
            report: JSON.stringify(report.report),
            transcription: report.transcription,
            time: JSON.stringify(report.time),
          },
        });
      });
    });

    it("Click next with no audio file prompts an error", async () => {
      jest.replaceProperty(RouterMock, "query", {
        slug: "",
      });
      await act(() => render(<Recording />));

      const submitButton = await screen.findByTestId("submit-button");

      act(() => submitButton.click());
      await waitFor(() => {
        expect(ToastMock.error).toHaveBeenCalledWith(
          "recording.error-no-audio-file",
        );
        expect(RouterMock.replace).toHaveBeenCalledWith("/app/dashboard");
      });
    });

    it("API genesis returns error", async () => {
      jest
        .spyOn(genesisService, "processAudioAndGenerateReport")
        .mockImplementation(() => {
          MessageHandler.get().handleError("Upstream Error");
          return Promise.resolve(null);
        });

      await act(() => render(<Recording />));

      const submitButton = await screen.findByTestId("submit-button");

      act(() => submitButton.click());
      await waitFor(() => {
        expect(ToastMock.error).toHaveBeenCalledWith("Upstream Error");
        expect(RouterMock.push).toHaveBeenCalledTimes(0);
      });
    });

    it("Click Delete Audio", async () => {
      await act(() => render(<Recording />));

      const deleteButton = await screen.findByTestId("recording.audio-delete");
      expect(deleteButton).toBeInTheDocument();

      act(() => deleteButton.click());

      await waitFor(() => screen.getByTestId("audio-delete"));
      screen.getByText("common.delete").click();

      expect(RouterMock.push).toHaveBeenCalledWith("/app/dashboard");
    });

    it("Click Save the Audio", async () => {
      await act(() => render(<Recording />));

      const saveButton = await screen.findByTestId("save-audio");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());
      expect(downloadAudioSpy).toHaveBeenCalledTimes(1);
      downloadAudioSpy.mockRestore();
    });
  });

  describe("Report Page", () => {
    let Report: CoreComponent;

    let audioUrl: string;
    let report: GenesisReport;
    const getProgressBar = () => screen.getByTestId("time-bar");
    const getRecordingTab = () => screen.getByText("recording.report");
    const getTranscriptionTab = () =>
      screen.getByText("recording.transcription");
    const getEditButton = () =>
      screen.queryByText("common.edit") as HTMLButtonElement;
    const getSaveButton = () =>
      screen.queryByText("common.save") as HTMLButtonElement;
    const getCancelButton = () =>
      screen.queryByText("common.cancel") as HTMLButtonElement;
    const getDownloadButton = () => screen.getByText("recording.download");

    const getNewRecordingButton = () =>
      screen.getByRole("button", { name: "recording.new-recording" });
    const getReplyButton = () => screen.getByTestId("replay-audio");

    const downloadReportSpy = jest.fn();
    jest
      .spyOn(Download, "downloadReport")
      .mockImplementation(downloadReportSpy);

    const downloadTranscriptionSpy = jest.fn();
    jest
      .spyOn(Download, "downloadTranscription")
      .mockImplementation(downloadTranscriptionSpy);

    beforeAll(() => {
      Report = getComponent("app", "report");
    });
    beforeEach(() => {
      audioUrl = faker.internet.url();
      report = Seed.new().report().create();

      setRouteQuery({
        report: JSON.stringify(report.report),
        transcription: report.transcription,
        time: JSON.stringify(report.time),
        audioUrl,
      });
    });
    afterEach(() => {});

    it("Report page mounts", () => {
      render(<Report />);
      expect(getProgressBar()).toBeInTheDocument();
      expect(getRecordingTab()).toBeInTheDocument();
      expect(getTranscriptionTab()).toBeInTheDocument();
      expect(getNewRecordingButton()).toBeInTheDocument();
      expect(getEditButton()).toBeInTheDocument();
      expect(getSaveButton()).not.toBeInTheDocument();
      expect(getDownloadButton()).toBeInTheDocument();
      expect(getReplyButton()).toBeInTheDocument();
    });

    it("Scenario: Query Data missing", async () => {
      setRouteQuery({ audioUrl });

      await act(() => render(<Report />));

      expect(RouterMock.push).toHaveBeenCalledWith("/app/dashboard");
    });
    it("Report tab contains report result", async () => {
      await act(() => render(<Report />));
      const entries = Object.entries(report.report);
      console.log({ Title: entries[0] });
      // Wait for it to be ready
      await waitFor(() => screen.getByText(entries[0][0]));

      entries.forEach(([title, content]) => {
        expect(screen.getByRole("heading", { name: title }));
        expect(screen.getByText(content)); // Dangerous html not allow check by role
      });
      // Transcription is hidden
      expect(
        screen.getByText(report.transcription[0]).closest(".hiddenContent"),
      ).toBeTruthy();
    });

    it("Transcription tab contains report result", async () => {
      await act(() => render(<Report />));
      act(() => getTranscriptionTab().click());

      await waitFor(() => screen.getByText(report.transcription[0]));

      report.transcription.forEach((transcription) => {
        expect(screen.getByText(transcription)).toBeInTheDocument();
      });
      // Report is hidden

      expect(
        screen
          .getByText(Object.values(report.report)[0])
          .closest(".hiddenContent"),
      ).toBeTruthy();
    });

    it("We can replay the audio", async () => {
      const playSpy = jest.spyOn(HTMLAudioElement.prototype, "play");
      const pauseSpy = jest.spyOn(HTMLAudioElement.prototype, "pause");

      await act(() => render(<Report />));

      screen.getByText("recording.replay-audio");

      getReplyButton().click();

      await waitFor(() => expect(playSpy).toHaveBeenCalled());

      screen.getByText("recording.pause-audio");

      getReplyButton().click();

      await waitFor(() => expect(pauseSpy).toHaveBeenCalled());

      screen.getByText("recording.replay-audio");
    });

    it("Click on New Recording", async () => {
      await act(() => render(<Report />));

      getNewRecordingButton().click();

      // TODO: Add alert message here that he needs to confirm or will lose the audio
      expect(RouterMock.push).toHaveBeenCalledWith("/app/dashboard");
    });
    it.todo("URL changes fires the not saved audio warning");

    it("Update the editor also updates the preview", async () => {
      const { container } = render(<Report />);
      act(() => getEditButton().click());

      await waitFor(() => container.querySelector(".ql-editor"));
      const qlEditor = container.querySelector(".ql-editor") as Element;
      // Get first title
      const firstTitle = qlEditor.querySelector("h3") as Element;
      expect(firstTitle).toBeTruthy();

      firstTitle.innerHTML = "My new title";
      await act(() => fireEvent.change(qlEditor, qlEditor.innerHTML));

      act(() => {
        getSaveButton().click();
      });

      await waitFor(() => screen.getByText("My new title").tagName === "H2");
      expect(screen.getByText("My new title").tagName).toEqual("H2");

      expect(getSaveButton()).not.toBeInTheDocument();
      expect(getEditButton()).toBeInTheDocument();
    });

    it("Cancel the editor don't update the preview", async () => {
      const { container } = render(<Report />);
      act(() => getEditButton().click());

      await waitFor(() => container.querySelector(".ql-editor"));

      expect(getCancelButton()).toBeInTheDocument();

      const qlEditor = container.querySelector(".ql-editor") as Element;
      // Get first title
      const firstTitle = qlEditor.querySelector("h3") as Element;
      expect(firstTitle).toBeTruthy();

      firstTitle.innerHTML = "My new title";
      await act(() => fireEvent.change(qlEditor, qlEditor.innerHTML));

      act(() => {
        getCancelButton().click();
      });
      // await waitForElementToBeRemoved(() => screen.getByText("My new title"));
      expect(screen.queryByText("My new title")).not.toBeInTheDocument();

      expect(getSaveButton()).not.toBeInTheDocument();
      expect(getEditButton()).toBeInTheDocument();
    });

    it("Download Audio", async () => {
      render(<Report />);
      getDownloadButton().click();

      const button = await screen.findByTestId("report.download-audio");

      act(() => button.click());

      expect(downloadAudioSpy).toHaveBeenCalledTimes(1);
    });

    it("Download Report", async () => {
      render(<Report />);
      getDownloadButton().click();

      const button = await screen.findByTestId("report.download-report");

      // const download = mockDownload();
      act(() => button.click());

      expect(downloadReportSpy).toHaveBeenCalledTimes(1);
    });

    it.todo("Verify Report Doc Content");

    it("Download Transcription", async () => {
      render(<Report />);
      getDownloadButton().click();

      const button = await screen.findByTestId("report.download-transcription");

      act(() => button.click());

      expect(downloadTranscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it.todo("Verify Transcription Doc content");

    it("Statistics bar shows right percentages", () => {
      render(<Report />);
      // getDownloadButton().click();
      const total = report.time.report + report.time.transcription;
      const reportWidth = (report.time.report / total) * 100;
      const transcriptionWidth = (report.time.transcription / total) * 100;

      const bar = screen.getByTestId("time-bar");
      const segments = bar.querySelectorAll(
        ".progressSegment",
      ) as unknown as HTMLDivElement[];

      expect(segments[2].style.width).toEqual(transcriptionWidth + "%");
      expect(segments[3].style.width).toEqual(reportWidth + "%");

      // const totalTime = screen.getByText("recording.total-time");
      // expect(totalTime.parentElement?.textContent).toContain(
      //   (total / 1000).toString(),
      // );
    });
  });
});
