import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Modal from "react-modal";
import userEvent from "@testing-library/user-event";
import { CoreComponent, GlobalCore } from "@/core/module/module.types";
import "./index";
import "@/services/auth/auth-mock.service";
import "@/services/templates/templates-mock.service";
import { SupabaseTemplateService } from "@/core/module/services.types";

import React, { act } from "react";
import { RouterMock } from "@/jest-setup";
import { getComponent, setRouteQuery } from "@/resources/tests/test.utils";
import { Seed } from "@/resources/tests/seed";
import {
  GenesisTemplate,
  GenesisTemplateField,
  TYPE_OPTIONS,
} from "@/core/module/core.types";

describe("===== TEMPLATES =====", () => {
  let templatesService: SupabaseTemplateService;

  beforeAll(() => {
    templatesService = GlobalCore.manager.getComponent(
      "service",
      "templates",
    ) as SupabaseTemplateService;
  });

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
      screen.debug();
    });

    it("Checks table is populated", async () => {
      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
    });

    it("Checks new entry is created in edit mode when add template", async () => {
      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("templates.new-template");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("templates.name-edit-field"),
        ).toBeInTheDocument();
      });

      const inputElement = screen.getByTestId("templates.name-edit-field");
      expect(inputElement).toHaveValue("New Template");
      expect(
        screen.getByText(new Date().toLocaleDateString()),
      ).toBeInTheDocument();
    });

    it("Checks template can be created", async () => {
      render(<Templates />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("templates.new-template");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("templates.name-edit-field"),
        ).toBeInTheDocument();
      });

      const inputElement = screen.getByTestId("templates.name-edit-field");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "Test Template");

      expect(inputElement).toHaveValue("Test Template");

      const saveButton = screen.getByTestId("templates.save-template");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.name-edit-field"),
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("Test Template"));
    });

    it("Checks input field when edit button is pressed", async () => {
      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.edit");
      act(() => templateEdit[0].click());

      expect(
        screen.getByTestId("templates.name-edit-field"),
      ).toBeInTheDocument();
    });

    it("Checks template can be edited", async () => {
      render(<Templates />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("templates.edit");
      act(() => templateEdit[0].click());

      const inputElement = screen.getByTestId("templates.name-edit-field");
      await userEvent.clear(inputElement);
      await userEvent.type(inputElement, "New Template Name");

      expect(inputElement).toHaveValue("New Template Name");

      const saveButton = screen.getByTestId("templates.save-template");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.name-edit-field"),
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("New Template Name"));
    });

    it("Checks modal pops up when delete icon clicked", async () => {
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

    it("Checks template delete function", async () => {
      render(<Templates />);

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

      const confirmButton = screen.getByTestId("modal.confirm-button");
      expect(confirmButton).toBeInTheDocument();
      act(() => confirmButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.delete-confirmation"),
        ).not.toBeInTheDocument();
      });

      // TODO: Make this check dynamic
      expect(screen.queryByText("New Template Name")).not.toBeInTheDocument();
    });

    it("Checks template redirect on select", async () => {
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
    beforeAll(() => {
      TemplateDetail = getComponent("app", "template-detail");
    });

    beforeEach(() => {
      setRouteQuery({ id: "2" });
    });
    afterEach(() => {});

    it("Templates Detail is Mounted", async () => {
      await act(() => render(<TemplateDetail />));

      expect(screen.getByTestId("template-detail.title")).toBeInTheDocument();
      expect(
        screen.getByTestId("template-detail.add-field"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("template-detail.table"),
      ).not.toBeInTheDocument();
      screen.debug();
    });

    it("Checks table is populated", async () => {
      render(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });
    });

    it("Checks new entry is created in edit mode when add template", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-name-input"),
        ).toBeInTheDocument();
      });

      const inputElement = screen.getByTestId(
        "template-detail.field-name-input",
      );
      expect((inputElement as HTMLInputElement).value).toMatch(/newField.*/i);
    });

    it("Checks template can be created", async () => {
      const NewField: GenesisTemplateField & { name: string } = {
        name: "Test Field",
        type: "text" as TYPE_OPTIONS,
        description: "Test Field Description",
      };
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-name-input"),
        ).toBeInTheDocument();
      });

      const nameInputElement = screen.getByTestId(
        "template-detail.field-name-input",
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, NewField.name);
      expect(nameInputElement).toHaveValue(NewField.name);

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select",
      );
      await userEvent.selectOptions(typeSelectElement, NewField.type);
      expect(typeSelectElement).toHaveValue(NewField.type);

      const descriptionInputElement = screen.getByTestId(
        "template-detail.field-description-input",
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, NewField.description);
      expect(descriptionInputElement).toHaveValue(NewField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("template-detail.field-name-input"),
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("Test Field"));
    });

    it("Checks input field when edit button is pressed", async () => {
      render(<TemplateDetail />);

      // Wait for the table to be fully rendered (at least one row is filled)
      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getAllByTestId("template-detail.edit");
      act(() => templateEdit[0].click());

      expect(
        screen.getByTestId("template-detail.field-name-input"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("template-detail.field-type-select"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("template-detail.field-description-input"),
      ).toBeInTheDocument();
    });

    it("Checks template can be edited", async () => {
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

      const nameInputElement = screen.getByTestId(
        "template-detail.field-name-input",
      );
      await userEvent.clear(nameInputElement);
      await userEvent.type(nameInputElement, AlteredField.name);
      expect(nameInputElement).toHaveValue(AlteredField.name);

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select",
      );
      await userEvent.selectOptions(typeSelectElement, AlteredField.type);
      expect(typeSelectElement).toHaveValue(AlteredField.type);

      const descriptionInputElement = screen.getByTestId(
        "template-detail.field-description-input",
      );
      await userEvent.clear(descriptionInputElement);
      await userEvent.type(descriptionInputElement, AlteredField.description);
      expect(descriptionInputElement).toHaveValue(AlteredField.description);

      const saveButton = screen.getByTestId("template-detail.save-field");
      expect(saveButton).toBeInTheDocument();

      act(() => saveButton.click());

      await waitFor(() => {
        expect(
          screen.queryByTestId("templates.name-edit-field"),
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("Altered Test Field"));
    });

    it("Checks config modal button when type != text", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select"),
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select",
      );
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

    it("Checks config modal opens when config button clicked", async () => {
      render(<TemplateDetail />);

      await waitFor(() => {
        expect(screen.getByTestId("table-row-0"));
      });

      const templateEdit = screen.getByTestId("template-detail.add-field");
      act(() => templateEdit.click());

      await waitFor(() => {
        expect(
          screen.getByTestId("template-detail.field-type-select"),
        ).toBeInTheDocument();
      });

      const typeSelectElement = screen.getByTestId(
        "template-detail.field-type-select",
      );

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

      const modal = await screen.findByTestId("template-detail.field-modal");
      expect(modal).toBeInTheDocument();
    });

    it("Checks modal pops up when delete icon clicked", async () => {
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

    it("Checks template delete function", async () => {
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

      // TODO: Make this check dynamic
      expect(screen.queryByText("Age")).not.toBeInTheDocument();
    });
  });
});
