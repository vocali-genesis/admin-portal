import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent, GlobalCore } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import "@/services/templates/templates-mock.service";

import React, { act } from "react";
import { jest } from "@jest/globals";
import { RouterMock } from "@/jest-setup";
import { getComponent, setRouteQuery } from "@/resources/tests/test.utils";

import { GenesisTemplateField, TYPE_OPTIONS } from "@/core/module/core.types";
import MessageHandler from "@/core/message-handler";

jest.mock("@/core/message-handler", () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(() => ({
        handleSuccess: jest.fn(),
        handleError: jest.fn(),
        info: jest.fn(),
      })),
    },
  };
});

describe("===== TEMPLATES =====", () => {
  beforeAll(() => {});

  describe("Templates Page", () => {
    let Templates: CoreComponent;
    beforeAll(() => {
      Templates = getComponent("app", "templates");
    });

    beforeEach(() => {});
    afterEach(() => {});

    it("Templates is Mounted", async () => {
      await act(() => render(<Templates />));

      expect(screen.getByTestId("templates.title")).toBeInTheDocument();
      expect(screen.getByTestId("templates.new-template")).toBeInTheDocument();
      expect(screen.queryByText("templates.table")).not.toBeInTheDocument();

      // Check templates tabke is populated
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
      screen.debug();
    });

    it("New entry is created in edit mode when add template", async () => {
      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.create",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      const inputElement = screen.getByRole("textbox");
      expect(inputElement).toHaveValue("New Template");
      expect(
        screen.getByText(new Date().toLocaleDateString()),
      ).toBeInTheDocument();
    });

    it("Template can be created", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );

      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.create",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      const inputElement = screen.getByRole("textbox");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "Test Template");

      expect(inputElement).toHaveValue("Test Template");

      const saveButton = screen.getByTestId("templates.save-template");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith("templates.createSuccess");
      expect(screen.getByText("Test Template"));

      handleSuccessSpy.mockRestore();
    });

    it("Input field when edit button is pressed", async () => {
      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.edit");
      act(() => templateEdit[0].click());

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("Template can be edited", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );

      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.edit");
      act(() => templateEdit[0].click());

      const inputElement = screen.getByRole("textbox");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "New Template Name");

      expect(inputElement).toHaveValue("New Template Name");

      const saveButton = screen.getByTestId("templates.save-template");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith("templates.editSuccess");
      expect(screen.getByText("New Template Name"));

      handleSuccessSpy.mockRestore();
    });

    it("Modal pops up when delete icon clicked", async () => {
      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("templates.delete-confirmation"),
        ).toBeInTheDocument();
      });
    });

    it("Template delete function", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );

      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByText("resources.confirm-delete"),
        ).toBeInTheDocument();
      });

      // screen.queryByRole("button", { name: "common.delete"}); doesn't work. I can't find out why
      const confirmButton = screen.getByTestId("modal.confirm-button");
      expect(confirmButton).toBeInTheDocument();
      act(() => confirmButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.delete-confirmation"),
        ).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith("templates.deleteSuccess");

      // TODO: Make this check dynamic
      expect(screen.queryByText("New Template Name")).not.toBeInTheDocument();

      handleSuccessSpy.mockRestore();
    });

    it("Template redirect on select", async () => {
      const spy = jest.spyOn(RouterMock, "push");
      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const headers = screen.getAllByTestId("templates.title-cell");
      act(() => headers[1].click());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/\/app\/template-detail\?id=.*/),
      );
    });
  });

  describe("Templates Detail Page", () => {
    let TemplateDetail: CoreComponent;
    const getModal = async () => {
      return await screen.findByTestId("template-detail.field-modal");
    };
    beforeAll(() => {
      TemplateDetail = getComponent("app", "template-detail");
    });

    beforeEach(() => {
      setRouteQuery({ id: "2" });
    });
    afterEach(() => {});

    it("Templates Detail is Mounted", async () => {
      await act(() => render(<TemplateDetail />));

      // Don't know the template name as yet
      expect(screen.getByTestId("template-detail.title")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "templates.addField" }),
      ).toBeInTheDocument();

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
      screen.debug();
    });

    it("New entry is created in edit mode when add template", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.addField",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("templates.fieldNamePlaceholder"),
        ).toBeInTheDocument();
      });

      const inputElement = screen.getByPlaceholderText(
        "templates.fieldNamePlaceholder",
      );
      expect((inputElement as HTMLInputElement).value).toMatch(/newField.*/i);
    });

    it("Template field can be created", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );
      const NewField: GenesisTemplateField & { name: string } = {
        name: "Test Field",
        type: "text" as TYPE_OPTIONS,
        description: "Test Field Description",
      };
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.addField",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("templates.fieldNamePlaceholder"),
        ).toBeInTheDocument();
      });

      const nameInputElement = screen.getByPlaceholderText(
        "templates.fieldNamePlaceholder",
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, NewField.name);
      expect(nameInputElement).toHaveValue(NewField.name);

      const typeSelectElement = await screen.findByRole("combobox");
      await userEvent.selectOptions(typeSelectElement, NewField.type);
      expect(typeSelectElement).toHaveValue(NewField.type);

      const descriptionInputElement = screen.getByPlaceholderText(
        "templates.descriptionPlaceholder",
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, NewField.description);
      expect(descriptionInputElement).toHaveValue(NewField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("templates.fieldNamePlaceholder"),
        ).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith("templates.editSuccess");
      expect(screen.getByText("Test Field"));

      handleSuccessSpy.mockRestore();
    });

    it("Input field when edit button is pressed", async () => {
      render(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[0].click());

      expect(
        screen.getByPlaceholderText("templates.fieldNamePlaceholder"),
      ).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("templates.descriptionPlaceholder"),
      ).toBeInTheDocument();
    });

    it("Template can be edited", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );
      const AlteredField: GenesisTemplateField & { name: string } = {
        name: "Altered Test Field",
        type: "number" as TYPE_OPTIONS,
        description: "Altered Test Field Description",
      };
      render(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[0].click());

      const nameInputElement = screen.getByPlaceholderText(
        "templates.fieldNamePlaceholder",
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, AlteredField.name);
      expect(nameInputElement).toHaveValue(AlteredField.name);

      const typeSelectElement = screen.getByRole("combobox");
      await userEvent.selectOptions(typeSelectElement, AlteredField.type);
      expect(typeSelectElement).toHaveValue(AlteredField.type);

      const descriptionInputElement = screen.getByPlaceholderText(
        "templates.descriptionPlaceholder",
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, AlteredField.description);
      expect(descriptionInputElement).toHaveValue(AlteredField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText("templates.fieldNamePlaceholder"),
        ).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith("templates.editSuccess");
      expect(screen.getByText("Altered Test Field"));

      handleSuccessSpy.mockRestore();
    });

    it("Config modal button when type != text", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.addField",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");
      expect(typeSelectElement).toHaveValue("text");
      expect(
        screen.queryByTestId("template-detail.edit-field-config"),
      ).not.toBeInTheDocument();

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });
    });

    it("Config modal opens when config button clicked", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByRole("button", {
        name: "templates.addField",
      });
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config",
      );
      act(() => configButton.click());

      const modal = await screen.findByText("Edit number Config");
      expect(modal).toBeInTheDocument();
    });

    it("Select config modal is populated", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[1].click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");
      expect(typeSelectElement).toHaveValue("select");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config",
      );
      act(() => configButton.click());

      const modal = await getModal();

      const { getAllByText } = within(modal);
      expect(getAllByText("number")[0]).toHaveClass("optionTag");
      expect(getAllByText("text")[0]).toHaveClass("optionTag");
    });

    it("Multiselect config modal is populated", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[2].click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");
      expect(typeSelectElement).toHaveValue("multiselect");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config",
      );
      act(() => configButton.click());

      const modal = await getModal();

      const { getByText } = within(modal);
      expect(getByText("integer")).toHaveClass("optionTag");
      expect(getByText("string")).toHaveClass("optionTag");
    });

    it("Select option", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[1].click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");
      expect(typeSelectElement).toHaveValue("select");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config",
      );
      act(() => configButton.click());

      const modal = await getModal();

      const { getAllByText } = within(modal);
      expect(getAllByText("multiselect")).toHaveLength(1);
      expect(getAllByText("multiselect")[0]).not.toHaveClass("optionTag");

      const optionSelectElement = screen.getByTestId(
        "field-modal.select-options",
      );
      await userEvent.selectOptions(optionSelectElement, "multiselect");

      await waitFor(() => {
        expect(getAllByText("multiselect")).toHaveLength(2);
        expect(getAllByText("multiselect")[0]).toHaveClass("optionTag");
      });
    });

    it("Multiselect option", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[2].click());

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByRole("combobox");
      expect(typeSelectElement).toHaveValue("multiselect");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config"),
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config",
      );
      act(() => configButton.click());

      const modal = await getModal();

      const { getByText, queryByText } = within(modal);
      expect(queryByText("test_type")).not.toBeInTheDocument();

      const optionInputElement = screen.getByTestId(
        "field-modal.multi-select-input",
      );
      await userEvent.type(optionInputElement, "test_type");

      const addOption = screen.getByTestId(
        "field-modal.multi-select-add-option",
      );
      expect(addOption).toBeInTheDocument();

      act(() => addOption.click());

      await waitFor(() => {
        expect(getByText("test_type")).toBeInTheDocument();
        expect(getByText("test_type")).toHaveClass("optionTag");
      });
    });

    it("Modal pops up when delete icon clicked", async () => {
      render(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.delete-confirmation"),
        ).toBeInTheDocument();
      });
    });

    it("Template delete function", async () => {
      const handleSuccessSpy = jest.spyOn(
        MessageHandler.get(),
        "handleSuccess",
      );
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.delete-confirmation"),
        ).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal.confirm-button");
      expect(confirmButton).toBeInTheDocument();
      act(() => confirmButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.delete-confirmation"),
        ).not.toBeInTheDocument();
      });

      expect(handleSuccessSpy).toHaveBeenCalledWith(
        "templates.fieldDeleteSuccess",
      );
      // TODO: Make this check dynamic
      expect(screen.queryByText("Age")).not.toBeInTheDocument();

      handleSuccessSpy.mockRestore();
    });
  });
});
