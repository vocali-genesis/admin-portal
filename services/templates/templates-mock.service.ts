import { GenesisTemplate } from "@/core/module/core.types";
import { PaginatedResponse } from "./supabase-templates.service";
import { faker } from "@faker-js/faker";
import { Seed } from "@/resources/tests/seed";

class MockTemplateService {
  private templates: GenesisTemplate[] = [];

  constructor() {
    this.templates = Seed.new().template().array(10);
  }

  async getTemplates(
    page: number = 1,
    pageSize: number = 8,
  ): Promise<PaginatedResponse<GenesisTemplate>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    const data = this.templates.slice(from, to);
    const totalCount = this.templates.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data,
      totalCount,
      totalPages,
    };
  }

  async getTemplate(id: number): Promise<GenesisTemplate | null> {
    return this.templates.find((template) => template.id === id) || null;
  }

  async createTemplate(
    template: Omit<GenesisTemplate, "id" | "createdAt" | "ownerId">,
  ): Promise<GenesisTemplate> {
    const newTemplate: GenesisTemplate = {
      id: faker.number.int(),
      createdAt: faker.date.past().toISOString(),
      ownerId: faker.string.uuid(),
      ...template,
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(
    id: number,
    updates: Partial<GenesisTemplate>,
  ): Promise<GenesisTemplate | null> {
    const index = this.templates.findIndex((template) => template.id === id);
    if (index === -1) return null;

    const updatedTemplate = { ...this.templates[index], ...updates };
    this.templates[index] = updatedTemplate;
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const index = this.templates.findIndex((template) => template.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    return true;
  }
}

export default new MockTemplateService();
