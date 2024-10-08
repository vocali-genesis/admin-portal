import { GlobalCore } from "@/core/module/module.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "@/resources/utils/config";
import MessageHandler from "@/core/message-handler";
import Service from "@/core/module/service.factory";
import { GenesisTemplate } from "@/core/module/core.types";

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

const messageHandler = MessageHandler.get();

class SupabaseTemplateService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = config.SUPABASE_URL as string;
    const supabaseAnonKey = config.SUPABASE_API_KEY as string;
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getTemplates(): Promise<GenesisTemplate[] | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    const { data, error } = await this.supabase
      .from("templates")
      .select("*", { count: "exact" })
      .eq("owner_id", userData?.id)
      .order("created_at", { ascending: false });

    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data as GenesisTemplate[];
  }

  async getTemplate(
    id: string,
    page: number = 1,
    pageSize: number = 8,
  ): Promise<PaginatedResponse<GenesisTemplate> | null> {
    const userData = await Service.require("oauth").getLoggedUser();
    const { data, error } = await this.supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .eq("owner_id", userData?.id)
      .single();

    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    const entries = Object.entries(data.fields);
    const totalCount = entries.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const paginatedEntries = entries.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );
    const paginatedFields = Object.fromEntries(paginatedEntries);

    const paginatedTemplate = {
      ...data,
      fields: paginatedFields,
    };

    return {
      data: [paginatedTemplate] as GenesisTemplate[],
      totalCount,
      totalPages,
    };
  }

  async createTemplate(
    template: Omit<GenesisTemplate, "id" | "created_at" | "owner_id">,
  ): Promise<GenesisTemplate | null> {
    const userData = await Service.get("oauth")?.getLoggedUser();

    const { data, error } = await this.supabase
      .from("templates")
      .insert({
        ...template,
        owner_id: userData?.id,
        created_at: new Date().toISOString(),
      })
      .select();
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data[0] as GenesisTemplate;
  }

  async updateTemplate(
    id: string,
    updates: Partial<GenesisTemplate>,
  ): Promise<GenesisTemplate | null> {
    const { data, error } = await this.supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      messageHandler.handleError(error.message);
      return null;
    }

    return data[0] as GenesisTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
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

GlobalCore.manager.service("templates", new SupabaseTemplateService());
