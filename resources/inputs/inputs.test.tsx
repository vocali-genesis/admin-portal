import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { faker } from "@faker-js/faker";
import { MediaDevicesMock } from "@/jest-setup";
import React, { act } from "react";
import { MicrophoneSelect } from "./microphones.select";

const SampleMicrophone = {
  deviceId: faker.string.uuid(),
  label: "Jest Microphone",
  kind: "audioinput",
};
describe("===== INPUTS =====", () => {
  describe("Microphone Select", () => {
    let mediaSpy: jest.SpyInstance<typeof MediaDevicesMock>;
    const onChange = jest.fn();
    beforeAll(() => {
      mediaSpy = jest.spyOn(MediaDevicesMock, "enumerateDevices");
    });

    beforeEach(() => {});
    afterEach(() => {
      mediaSpy.mockReset();
      onChange.mockReset();
    });

    it("First time we require permissions", async () => {
      mediaSpy.mockReturnValueOnce([]);
      await act(() =>
        render(<MicrophoneSelect value="" onChange={onChange} />)
      );

      const permissions = await screen.findByText(
        "resources.allow-permissions"
      );

      expect(permissions).toBeInTheDocument();

      mediaSpy.mockReturnValueOnce([SampleMicrophone]);

      permissions.click();

      await waitForElementToBeRemoved(() =>
        screen.getByText("resources.allow-permissions")
      );
    });

    it("Display Available microphones", async () => {
      mediaSpy.mockReturnValueOnce([SampleMicrophone]);
      await act(() =>
        render(<MicrophoneSelect value="" onChange={onChange} />)
      );

      await screen.findByRole("option", { name: "Jest Microphone" });
    });
  });
});
