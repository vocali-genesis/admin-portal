import { CENTS, InvoiceResponse } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";
import moment from "moment";

export class Seed {
  public static new() {
    return new Seed();
  }
  public user(props: Partial<{ email: string; created_at: string }> = {}) {
    const user = {
      id: faker.string.uuid(),
      created_at: moment().format(),
      email: faker.internet.email(),
      // Props override the data
      ...props,
    };
    const token = faker.string.hexadecimal({ length: 12 });

    return { user, token };
  }
  public invoice(props: Partial<InvoiceResponse> = {}): InvoiceResponse {
    const invoice = {
      invoice_id: faker.string.uuid(),
      created_at: faker.date.past().toISOString(),
      amount: (+faker.finance.amount({ min: 10, max: 300 }) * 100) as CENTS,
      invoice_url: faker.internet.url(),
      ...props,
    };
    return invoice;
  }
}
