import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoreComponent } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import "@/services/templates/templates-mock.service";

import React, { act } from "react";
import { RouterMock } from "@/jest-setup";
import { getComponent, setRouteQuery } from "@/resources/tests/test.utils";
import { GenesisTemplateField, TYPE_OPTIONS } from "@/core/module/core.types";
import { renderWithStore } from "@/resources/tests/test-render.utils";

describe("===== TEMPLATES =====", () => {
  beforeAll(() => { });

  describe("Templates Page", () => {
    let Templates: CoreComponent;
    beforeAll(() => {
      Templates = getComponent("app", "templates");
    });

    beforeEach(() => { });
    afterEach(() => { });

    it("Templates is Mounted", async () => {
      await act(() => renderWithStore(<Templates />));

      expect(screen.getByTestId("templates.title")).toBeInTheDocument();
      expect(screen.getByTestId("templates.new-template")).toBeInTheDocument();
      expect(screen.queryByText("templates.table")).not.toBeInTheDocument();
    });

    it("Checks table is populated", async () => {
      renderWithStore(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
    });

    it("Checks template can be created", async () => {
      renderWithStore(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      screen.debug(screen.getByTestId("table-row-0"))

      const templateEdit = screen.getByTestId("templates.new-template");
      act(() => templateEdit.click());


      // There are 10 mockups, next one is 11
      await waitFor(() => {
        expect(
          screen.getByText("templates.template 11")
        ).toBeInTheDocument();
      });


      expect(screen.getByText("templates.template 11"));
    });

    it("Checks modal pops up when delete icon clicked", async () => {
      renderWithStore(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("templates.delete-confirmation")
        ).toBeInTheDocument();
      });
    });


    it("Checks template delete function", async () => {
      renderWithStore(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("templates.delete-confirmation")
        ).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal.confirm-button");
      expect(confirmButton).toBeInTheDocument();
      act(() => confirmButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.delete-confirmation")
        ).not.toBeInTheDocument();
      });

      // TODO: Make this check dynamic
      expect(screen.queryByText("New Template Name")).not.toBeInTheDocument();
    });

    it("Checks template redirect on select", async () => {
      const spy = jest.spyOn(RouterMock, "push");
      renderWithStore(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const eyeIcon = screen.getAllByTestId("templates.view");
      act(() => eyeIcon[1].click());

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.stringMatching(/\/app\/template-detail\?id=.*/)
      );
    });
  });

  describe("Templates Detail Page", () => {
    let TemplateDetail: CoreComponent;
    beforeAll(() => {
      TemplateDetail = getComponent("app", "template-detail");
    });

    beforeEach(() => {
      setRouteQuery({ id: "C" });
    });
    afterEach(() => { });

    it("Templates Detail is Mounted", async () => {
      await act(() => renderWithStore(<TemplateDetail />));

      await waitFor(() => {
        expect(screen.getByTestId("template-detail.title")).toBeInTheDocument();
      });
      
      expect(
        screen.getByTestId("template-detail.add-field")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("template-detail.table")
      ).not.toBeInTheDocument();

    });

    it("Checks template is loaded", async () => {
      renderWithStore(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
      await waitFor(() => screen.findByTestId('template-detail.title'))

    });
    it("Checks Edit title can be edited", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => screen.findByTestId('template-detail.title'))

      const templateEdit = screen.getByTestId("template-detail.edit-title");

      act(() => templateEdit.click());

      await waitFor(() => {
        screen.getByTestId("template-detail.template-name-input")
      });

      const inputElement = screen.getByTestId("template-detail.template-name-input");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "New Template Name");

      expect(inputElement).toHaveValue("New Template Name");

      const saveButton = screen.getByTestId("template-detail.save-title");

      act(() => saveButton.click());

      await waitFor(() => {
        screen.getByTestId("template-detail.title")
      });
      await waitFor(() => {
        screen.getByText("New Template Name")
      });


    });

    it("Checks Edit title can be cancel", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => screen.findByTestId('template-detail.title'))

      const templateEdit = screen.getByTestId("template-detail.edit-title");

      act(() => templateEdit.click());

      await waitFor(() => {
        screen.getByTestId("template-detail.template-name-input")
      });

      const inputElement = screen.getByTestId("template-detail.template-name-input");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "Template to be Cancel");

      const cancel = screen.getByTestId("template-detail.cancel-title");

      act(() => cancel.click());

      await waitFor(() => {
        screen.getByTestId("template-detail.title")
      });
      expect(
        screen.queryByText("Template to be Cancel")
      ).not.toBeInTheDocument()

    });




    it("Checks new entry is created in edit mode when add template", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-name-input")
        ).toBeInTheDocument();
      });

      const inputElement = screen.getByTestId(
        "template-detail.field-name-input"
      );
      expect((inputElement as HTMLInputElement).value).toMatch(/newField.*/i);
    });

    it("Checks template can be created", async () => {
      const NewField: GenesisTemplateField & { name: string } = {
        name: "Test Field",
        type: "text" as TYPE_OPTIONS,
        description: "Test Field Description",
      };
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-name-input")
        ).toBeInTheDocument();
      });

      const nameInputElement = screen.getByTestId(
        "template-detail.field-name-input"
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, NewField.name);
      expect(nameInputElement).toHaveValue(NewField.name);

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      await userEvent.selectOptions(typeSelectElement, NewField.type);
      expect(typeSelectElement).toHaveValue(NewField.type);

      const descriptionInputElement = screen.getByTestId(
        "template-detail.field-description-input"
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, NewField.description);
      expect(descriptionInputElement).toHaveValue(NewField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.field-name-input")
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("Test Field"));
    });

    it("Checks input field when edit button is pressed", async () => {
      renderWithStore(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[0].click());

      expect(
        screen.getByTestId("template-detail.field-name-input")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("template-detail.field-type-select")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("template-detail.field-description-input")
      ).toBeInTheDocument();
    });

    it("Checks template can be edited", async () => {
      const AlteredField: GenesisTemplateField & { name: string } = {
        name: "Altered Test Field",
        type: "number" as TYPE_OPTIONS,
        description: "Altered Test Field Description",
      };
      renderWithStore(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[0].click());

      const nameInputElement = screen.getByTestId(
        "template-detail.field-name-input"
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, AlteredField.name);
      expect(nameInputElement).toHaveValue(AlteredField.name);

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      await userEvent.selectOptions(typeSelectElement, AlteredField.type);
      expect(typeSelectElement).toHaveValue(AlteredField.type);

      const descriptionInputElement = screen.getByTestId(
        "template-detail.field-description-input"
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, AlteredField.description);
      expect(descriptionInputElement).toHaveValue(AlteredField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.name-edit-field")
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("Altered Test Field"));
    });

    it("Checks config modal button when type != text", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select")
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      expect(typeSelectElement).toHaveValue("text");
      expect(
        screen.queryByTestId("template-detail.edit-field-config")
      ).not.toBeInTheDocument();

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });
    });

    it("Checks config modal opens when config button clicked", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select")
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );

      await userEvent.selectOptions(typeSelectElement, "number");
      expect(typeSelectElement).toHaveValue("number");
      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config"
      );
      act(() => configButton.click());

      const modal = await screen.findByTestId("template-detail.field-modal");
      expect(modal).toBeInTheDocument();
    });

    it("Checks select config modal is populated", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[1].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select")
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      expect(typeSelectElement).toHaveValue("select");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config"
      );
      act(() => configButton.click());

      const modal = await screen.findByTestId("template-detail.field-modal");
      expect(modal).toBeInTheDocument();

      const modalItem = within(modal);
      expect(modalItem.getAllByText("number")[0]).toHaveClass("optionTag");
      expect(modalItem.getAllByText("text")[0]).toHaveClass("optionTag");
    });

    it("Checks multiselect config modal is populated", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[2].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select")
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      expect(typeSelectElement).toHaveValue("multiselect");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config"
      );
      act(() => configButton.click());

      const modal = await screen.findByTestId("template-detail.field-modal");
      expect(modal).toBeInTheDocument();

      const modalItem = within(modal);
      expect(modalItem.getByText("integer")).toHaveClass("optionTag");
      expect(modalItem.getByText("string")).toHaveClass("optionTag");
    });

    it("Checks multiselect option works", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[2].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select")
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select"
      );
      expect(typeSelectElement).toHaveValue("multiselect");

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.edit-field-config")
        ).toBeInTheDocument();
      });

      const configButton = screen.getByTestId(
        "template-detail.edit-field-config"
      );
      act(() => configButton.click());

      const modal = await screen.findByTestId("template-detail.field-modal");
      expect(modal).toBeInTheDocument();

      const modalItem = within(modal);
      expect(modalItem.queryByText("test_type")).not.toBeInTheDocument();

      const optionInputElement = screen.getByTestId(
        "field-modal.multi-select-input"
      );
      await userEvent.type(optionInputElement, "test_type");
      optionInputElement.focus();
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(modalItem.getByText("test_type")).toBeInTheDocument();
        expect(modalItem.getByText("test_type")).toHaveClass("optionTag");
      });
    });

    it("Checks modal pops up when delete icon clicked", async () => {
      renderWithStore(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.delete-confirmation")
        ).toBeInTheDocument();
      });
    });

    it("Checks template delete function", async () => {
      renderWithStore(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.delete");
      act(() => templateEdit[0].click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.delete-confirmation")
        ).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal.confirm-button");
      expect(confirmButton).toBeInTheDocument();
      act(() => confirmButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.delete-confirmation")
        ).not.toBeInTheDocument();
      });

      // TODO: Make this check dynamic
      expect(screen.queryByText("Age")).not.toBeInTheDocument();
    });
  });
});
