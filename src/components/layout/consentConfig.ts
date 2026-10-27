export const CONSENT_KEY = 'dadelsteen_consent'
export const CONSENT_VERSION = 1

/**
 * Inline script for <head>: Google Consent Mode v2 defaults (everything denied) and re-applies a
 * stored choice before any tag loads.
 */
export const consentDefaultsScript = `
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c&&c.version===${CONSENT_VERSION}){var g=function(b){return b?'granted':'denied'};gtag('consent','update',{analytics_storage:g(c.analytics),ad_storage:g(c.marketing),ad_user_data:g(c.marketing),ad_personalization:g(c.marketing)});}}catch(e){}
`.trim()
