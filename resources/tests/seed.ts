import {
  GenesisReport,
  GenesisUser,
  GenesisTemplate,
} from "@/core/module/core.types";
import { CENTS, GenesisInvoice } from "@/core/module/core.types";
import { faker } from "@faker-js/faker";
import moment from "moment";
import { TextEncoder } from "util";

export class Seed {
  public static new() {
    return new Seed();
  }
  public user(props: Partial<GenesisUser> = {}) {
    function user(props: Partial<GenesisUser>) {
      const user = {
        id: faker.string.uuid(),
        created_at: moment().format(),
        email: faker.internet.email(),
        ...props,
      };

      return user;
    }
    return new SeedBuilder<GenesisUser>(user, props);
  }
  public invoice(props: Partial<GenesisInvoice> = {}) {
    function invoice(props: Partial<GenesisInvoice> = {}) {
      return {
        invoice_id: faker.string.uuid(),
        created_at: faker.date.past().toISOString(),
        metadata: {
          period_end: faker.date.future().toISOString(),
        },
        amount: (+faker.finance.amount({ min: 10, max: 300 }) * 100) as CENTS,
        invoice_url: faker.internet.url(),
        ...props,
      };
    }
    return new SeedBuilder<GenesisInvoice>(invoice, props);
  }

  public report(props: Partial<GenesisReport> = {}) {
    function report(props: Partial<GenesisReport>): GenesisReport {
      const { time, ...mainProps } = props;
      const reportJSON = faker.lorem
        .paragraphs({ min: 2, max: 5 }, "\n")
        .split("\n")
        .reduce(
          (report, paragraph: string) => ({
            ...report,
            [faker.word.words()]: paragraph,
          }),
          {} as Record<string, string>,
        );

      return {
        report: reportJSON,
        transcription: faker.lorem
          .sentences({ min: 10, max: 15 }, "\n")
          .split("\n"),
        ...mainProps,
        time: {
          transcription: faker.number.float({ min: 10, max: 15 }) * 1000,
          report: faker.number.float({ min: 10, max: 15 }) * 1000,
          ...time,
        },
      };
    }
    return new SeedBuilder<GenesisReport>(report, props);
  }

  public file(props: { data?: Uint8Array; type?: string; name: string }): File {
    const type = props.type || "image/png";

    const audioBlob = this.blob({ data: props.data, type });

    const fakeAudioFile = new File([audioBlob], props.name, {
      type,
    });

    return fakeAudioFile;
  }

  public blob(props: { data?: Uint8Array; type?: string }): Blob {
    const randomData = Array.from({
      length: faker.number.int({ min: 4, max: 30 }),
    }).map(() => faker.number.binary());
    const encoder = new TextEncoder();
    const sharedArrayBuffer = encoder.encode(JSON.stringify(randomData))
      .buffer as SharedArrayBuffer;
    const fileData = props.data || new Uint8Array(sharedArrayBuffer);

    const type = props.type || "image/png";
    const audioBlob = new Blob([fileData], {
      type,
    });

    return audioBlob;
  }

  public template(
    props: Partial<GenesisTemplate> = {},
  ): SeedBuilder<GenesisTemplate> {
    function template(props: Partial<GenesisTemplate>): GenesisTemplate {
      return {
        id: faker.number.int(),
        ownerId: faker.string.uuid(),
        name: faker.company.name(),
        createdAt: faker.date.past().toISOString(),
        preview: faker.image.imageUrl(),
        fields: {},
        ...props,
      };
    }
    return new SeedBuilder<GenesisTemplate>(template, props);
  }
}

class SeedBuilder<T> {
  private builder: (props: Partial<T>) => T;
  private props: Partial<T>;
  private sample: T;

  constructor(builder: (props: Partial<T>) => T, props: Partial<T>) {
    this.builder = builder;
    this.props = props;
    this.sample = this.builder(props);
  }

  create() {
    return this.builder(this.props);
  }

  promise() {
    return Promise.resolve(this.builder(this.props));
  }

  array(count: number, arrayProps?: Array<Partial<T>>): T[] {
    return Array.from({ length: count }).map((_, index) => {
      const prop = arrayProps
        ? arrayProps[index % arrayProps.length]
        : this.props;

      return this.builder(prop);
    });
  }
  valueOf() {
    return this.sample;
  }
}
