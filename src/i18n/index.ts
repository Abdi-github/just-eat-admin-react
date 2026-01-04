import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// EN translations
import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import dashboardEn from './locales/en/dashboard.json';
import restaurantsEn from './locales/en/restaurants.json';
import ordersEn from './locales/en/orders.json';
import usersEn from './locales/en/users.json';
import reviewsEn from './locales/en/reviews.json';
import cuisinesEn from './locales/en/cuisines.json';
import brandsEn from './locales/en/brands.json';
import locationsEn from './locales/en/locations.json';
import paymentsEn from './locales/en/payments.json';
import deliveriesEn from './locales/en/deliveries.json';
import promotionsEn from './locales/en/promotions.json';
import analyticsEn from './locales/en/analytics.json';
import notificationsEn from './locales/en/notifications.json';
import settingsEn from './locales/en/settings.json';
import applicationsEn from './locales/en/applications.json';

// DE translations
import commonDe from './locales/de/common.json';
import authDe from './locales/de/auth.json';
import dashboardDe from './locales/de/dashboard.json';
import restaurantsDe from './locales/de/restaurants.json';
import ordersDe from './locales/de/orders.json';
import usersDe from './locales/de/users.json';
import reviewsDe from './locales/de/reviews.json';
import cuisinesDe from './locales/de/cuisines.json';
import brandsDe from './locales/de/brands.json';
import locationsDe from './locales/de/locations.json';
import paymentsDe from './locales/de/payments.json';
import deliveriesDe from './locales/de/deliveries.json';
import promotionsDe from './locales/de/promotions.json';
import analyticsDe from './locales/de/analytics.json';
import notificationsDe from './locales/de/notifications.json';
import settingsDe from './locales/de/settings.json';
import applicationsDe from './locales/de/applications.json';

// FR translations
import commonFr from './locales/fr/common.json';
import authFr from './locales/fr/auth.json';
import dashboardFr from './locales/fr/dashboard.json';
import restaurantsFr from './locales/fr/restaurants.json';
import ordersFr from './locales/fr/orders.json';
import usersFr from './locales/fr/users.json';
import reviewsFr from './locales/fr/reviews.json';
import cuisinesFr from './locales/fr/cuisines.json';
import brandsFr from './locales/fr/brands.json';
import locationsFr from './locales/fr/locations.json';
import paymentsFr from './locales/fr/payments.json';
import deliveriesFr from './locales/fr/deliveries.json';
import promotionsFr from './locales/fr/promotions.json';
import analyticsFr from './locales/fr/analytics.json';
import notificationsFr from './locales/fr/notifications.json';
import settingsFr from './locales/fr/settings.json';
import applicationsFr from './locales/fr/applications.json';

// IT translations
import commonIt from './locales/it/common.json';
import authIt from './locales/it/auth.json';
import dashboardIt from './locales/it/dashboard.json';
import restaurantsIt from './locales/it/restaurants.json';
import ordersIt from './locales/it/orders.json';
import usersIt from './locales/it/users.json';
import reviewsIt from './locales/it/reviews.json';
import cuisinesIt from './locales/it/cuisines.json';
import brandsIt from './locales/it/brands.json';
import locationsIt from './locales/it/locations.json';
import paymentsIt from './locales/it/payments.json';
import deliveriesIt from './locales/it/deliveries.json';
import promotionsIt from './locales/it/promotions.json';
import analyticsIt from './locales/it/analytics.json';
import notificationsIt from './locales/it/notifications.json';
import settingsIt from './locales/it/settings.json';
import applicationsIt from './locales/it/applications.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    supportedLngs: ['de', 'en', 'fr', 'it'],
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'dashboard',
      'restaurants',
      'orders',
      'users',
      'reviews',
      'cuisines',
      'brands',
      'locations',
      'payments',
      'deliveries',
      'promotions',
      'analytics',
      'notifications',
      'settings',
      'applications',
    ],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    resources: {
      en: {
        common: commonEn,
        auth: authEn,
        dashboard: dashboardEn,
        restaurants: restaurantsEn,
        orders: ordersEn,
        users: usersEn,
        reviews: reviewsEn,
        cuisines: cuisinesEn,
        brands: brandsEn,
        locations: locationsEn,
        payments: paymentsEn,
        deliveries: deliveriesEn,
        promotions: promotionsEn,
        analytics: analyticsEn,
        notifications: notificationsEn,
        settings: settingsEn,
        applications: applicationsEn,
      },
      de: {
        common: commonDe,
        auth: authDe,
        dashboard: dashboardDe,
        restaurants: restaurantsDe,
        orders: ordersDe,
        users: usersDe,
        reviews: reviewsDe,
        cuisines: cuisinesDe,
        brands: brandsDe,
        locations: locationsDe,
        payments: paymentsDe,
        deliveries: deliveriesDe,
        promotions: promotionsDe,
        analytics: analyticsDe,
        notifications: notificationsDe,
        settings: settingsDe,
        applications: applicationsDe,
      },
      fr: {
        common: commonFr,
        auth: authFr,
        dashboard: dashboardFr,
        restaurants: restaurantsFr,
        orders: ordersFr,
        users: usersFr,
        reviews: reviewsFr,
        cuisines: cuisinesFr,
        brands: brandsFr,
        locations: locationsFr,
        payments: paymentsFr,
        deliveries: deliveriesFr,
        promotions: promotionsFr,
        analytics: analyticsFr,
        notifications: notificationsFr,
        settings: settingsFr,
        applications: applicationsFr,
      },
      it: {
        common: commonIt,
        auth: authIt,
        dashboard: dashboardIt,
        restaurants: restaurantsIt,
        orders: ordersIt,
        users: usersIt,
        reviews: reviewsIt,
        cuisines: cuisinesIt,
        brands: brandsIt,
        locations: locationsIt,
        payments: paymentsIt,
        deliveries: deliveriesIt,
        promotions: promotionsIt,
        analytics: analyticsIt,
        notifications: notificationsIt,
        settings: settingsIt,
        applications: applicationsIt,
      },
    },
  });

export default i18n;
