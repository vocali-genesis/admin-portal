import { GlobalCore } from "@/core/module/module.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";
import Service from "@/core/module/service.factory";

const messageHandler = MessageHandler.get();

export interface TemplateField {
  type: "text" | "number" | "multiselect";
  description: string;
  options?: string[];
}

export interface Template {
  id: number;
  ownerId: string;
  name: string;
  createdAt: string;
  preview: string;
  fields: { [key: string]: TemplateField };
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

class TemplateService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getTemplates(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Template> | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from("templates")
      .select("*", { count: 'exact' })
      .eq("ownerId", userData?.id)
      .range(from, to);

    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: data as Template[],
      totalCount,
      totalPages
    };
  }

  async getTemplate(id: number): Promise<Template | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .eq("ownerId", userData?.id)
      .select();
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data[0] as Template;
  }

  async createTemplate(
    template: Omit<Template, "id" | "createdAt" | "ownerId">,
  ): Promise<Template | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    const { data, error } = await this.supabase
      .from("templates")
      .insert({ ...template, ownerId: userData?.id })
      .select();
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data[0] as Template;
  }

  async updateTemplate(
    id: number,
    updates: Partial<Template>,
  ): Promise<Template | null> {
    const { data, error } = await this.supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data[0] as Template;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from("templates")
      .delete()
      .eq("id", id);
    if (error) {
      messageHandler.handleError(error.message);
      return false;
    }
    return true;
  }
}

GlobalCore.manager.service("templates", new TemplateService());
