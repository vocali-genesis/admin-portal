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

  describe("Dasboard Page", () => {
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

    it.skip("Audio is recorded between pauses", () => {});
    it.skip("Button audio changes according to the volume", () => {});

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
});
