import { GlobalCore } from "@/core/module/module.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

export interface TemplateField {
  type: string;
  description: string;
}

export interface Template {
  id: number;
  ownerId: string;
  name: string;
  createdAt: string;
  preview: string;
  fields: TemplateField; // Might want to define a more specific type for fields
}

class TemplateService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getTemplates(): Promise<Template[] | null> {
    let { data: templates, error } = await this.supabase
      .from("templates")
      .select("*");
    if (error) return messageHandler.handleError(error.message);
    return templates as Template[];
  }

  async getTemplate(id: number): Promise<Template | null> {
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return messageHandler.handleError(error.message);
    return data as Template;
  }

  async createTemplate(
    template: Omit<Template, "id" | "createdAt">,
  ): Promise<Template | null> {
    const { data, error } = await this.supabase
      .from("templates")
      .insert(template)
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

  async deleteTemplate(id: number): Promise<boolean | null> {
    const { error } = await this.supabase
      .from("templates")
      .delete()
      .eq("id", id);
    if (error) return messageHandler.handleError(error.message);
    return true;
  }
}

export default new TemplateService();
