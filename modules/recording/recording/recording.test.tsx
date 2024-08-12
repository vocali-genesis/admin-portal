import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent, GlobalCore } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import "@/services/genesis/genesis-mock.service";
import {
  AuthService,
  MedicalTranscription,
} from "@/core/module/services.types";

import { faker } from "@faker-js/faker";
import {
  FetchMock,
  MediaDevicesMock,
  RouterMock,
  ToastMock,
  TranslationMock,
} from "@/jest-setup";
import MessageHandler from "@/core/message-handler";
import React, { act } from "react";
import { getComponent, login } from "@/resources/tests/test.utils";
import { Seed } from "@/resources/tests/seed";

const getInput = (container: HTMLElement, inputName: string) => {
  return container.querySelector(`input[name="${inputName}"]`) as Element;
};
describe("===== RECORDING LOGIN =====", () => {
  let authService: AuthService;
  let genesisService: MedicalTranscription;

  beforeAll(() => {
    authService = GlobalCore.manager.getComponent(
      "service",
      "oauth"
    ) as AuthService;
    genesisService = GlobalCore.manager.getComponent(
      "service",
      "medical-api"
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
    });

    it("Can't record without permissions", async () => {
      mediaSpy.mockReturnValueOnce([]);
      await act(() => render(<Dashboard />));

      act(() => screen.getByTestId("record-button").click());

      expect(ToastMock.error).toHaveBeenCalledWith(
        "recording.permission-required"
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
        Seed.new().file({ name: "audio.mp3", type: "audio/mp3" })
      );

      await waitFor(() => screen.getByText("audio.mp3"));
    });

    it("File error: Wrong format file", async () => {
      await act(() => render(<Dashboard />));
      const input = screen.getByTestId("upload-recording");

      await userEvent.upload(
        input,
        Seed.new().file({ name: "image.mp3", type: "image/mp3" })
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
        Seed.new().file({ name: "audio.png", type: "audio/png" })
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
          Seed.new().file({ name: "audio.mp3", type: "audio/mp3" })
        );
    });
    beforeEach(() => {
      audioUrl = faker.internet.url();
      jest.replaceProperty(RouterMock, "query", {
        audioUrl,
      });
    });
    afterEach(() => {});

    it("Recording page mounts", () => {
      render(<Recording />);
      expect(screen.findByTestId("audio-player"));
      expect(screen.findByRole("button", { name: "recording.submit" }));
    });

    it("Click next we call the transcription api", async () => {
      // Mock API response
      const report = Seed.new().report().create();
      jest
        .spyOn(genesisService, "processAudioAndGenerateReport")
        .mockResolvedValue(report);

      await act(() => render(<Recording />));

      const submitButton = await screen.findByRole("button", {
        name: "recording.submit",
      });

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
      // Mock the blog
      jest.replaceProperty(RouterMock, "query", {
        audioUrl: "",
      });
      await act(() => render(<Recording />));

      const submitButton = await screen.findByRole("button", {
        name: "recording.submit",
      });

      act(() => submitButton.click());
      await waitFor(() => {
        expect(ToastMock.error).toHaveBeenCalledWith(
          "recording.error-no-audio-file"
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

      const submitButton = await screen.findByRole("button", {
        name: "recording.submit",
      });

      act(() => submitButton.click());
      await waitFor(() => {
        expect(ToastMock.error).toHaveBeenCalledWith("Upstream Error");
        expect(RouterMock.push).toHaveBeenCalledTimes(0);
      });
    });

    it("Click Delete Audio", async () => {
      const { container } = await act(() => render(<Recording />));

      const deleteButton = container.querySelector(
        "button[name='delete']"
      ) as HTMLButtonElement;
      expect(deleteButton).toBeDefined();

      act(() => deleteButton.click());

      await waitFor(() => screen.getByTestId("delete-confirmation"));
      screen.getByText("common.delete").click();

      expect(RouterMock.push).toHaveBeenCalledWith("/app/dashboard");
    });

    it("Click Save the Audio", async () => {
      const { container } = await act(() => render(<Recording />));

      const saveButton = container.querySelector(
        "button[name='save']"
      ) as HTMLButtonElement;

      expect(saveButton).toBeDefined();
      const appendSpy = jest.spyOn(document.body, "appendChild");
      const removeSpy = jest.spyOn(document.body, "removeChild");

      act(() => saveButton.click());
      const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
      expect(anchor.href).toEqual(audioUrl);

      expect(removeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
