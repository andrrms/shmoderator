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
