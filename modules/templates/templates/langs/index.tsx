import { GlobalCore } from "@/core/module/module.types";
import en from "./en.json";
import es from "./es.json";
import ca from "./ca.json";
import pt from "./pt.json";

GlobalCore.manager.langs("templates", { en, es, ca, pt });
