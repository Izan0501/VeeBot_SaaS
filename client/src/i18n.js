import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

// Configuración básica de i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    lng: localStorage.getItem('app_language') || 'es', // Idioma por defecto o guardado
    fallbackLng: 'en', // Fallback si no encuentra una traducción
    interpolation: {
      escapeValue: false // React ya hace un escape por defecto de XSS
    }
  });

export default i18n;
