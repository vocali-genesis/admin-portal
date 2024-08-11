import { GlobalCore } from "@/core/module/module.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";

export interface Template {
  id: number;
  ownerId: string;
  name: string;
  createdAt: string;
  preview: string;
  fields: object; // Might want to define a more specific type for fields
}

class TemplateService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getTemplates(): Promise<Template[]> {
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) console.log(error);
    console.log(data);
    return data as Template[];
  }

  async createTemplate(
    template: Omit<Template, "id" | "createdAt">,
  ): Promise<Template> {
    const { data, error } = await this.supabase
      .from("templates")
      .insert(template)
      .single();
    if (error) throw error;
    return data as Template;
  }

  async updateTemplate(
    id: number,
    updates: Partial<Template>,
  ): Promise<Template> {
    const { data, error } = await this.supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Template;
  }

  async deleteTemplate(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("templates")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
}

// GlobalCore.manager.service("templates", new TemplateService());
export default new TemplateService();
