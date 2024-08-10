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

class TemplateService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getTemplates(): Promise<Template[] | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    let { data: templates, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("ownerId", userData?.id)
      .select();
    if (error) return messageHandler.handleError(error.message);
    return templates as Template[];
  }

  async getTemplate(id: number): Promise<Template | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .eq("ownerId", userData?.id)
      .select();
    if (error) return messageHandler.handleError(error.message);
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
    if (error) return messageHandler.handleError(error.message);
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
    if (error) return messageHandler.handleError(error.message);
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

export default new TemplateService();
