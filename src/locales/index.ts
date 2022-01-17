import { I18n } from "@grammyjs/i18n";

const i18n = new I18n({
  defaultLanguage: "en",
  defaultLanguageOnMissing: true,
  directory: "./src/locales/",
});

export default i18n;
