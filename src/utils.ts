import enLocale from "./locales/en.json";
import i18n from "./locales";

export type Errors = keyof typeof enLocale["errors"];

export class GameError extends Error {
  constructor(
    type: Errors,
    lang: string = "en",
    public skipReply: boolean = false
  ) {
    // TODO: Implement internationalization
    super(i18n.t(lang, `errors.${type}`));

    this.name = type;
  }
}

export class Payload {
  public static encode(data: string): string {
    const buffer: string = Buffer.from(data).toString("base64");
    if (buffer.length > 64) throw new Error("Payload is too long");

    return buffer;
  }

  public static decode(data: string): string {
    const buffer: Buffer = Buffer.from(data, "base64");
    return buffer.toString();
  }
}