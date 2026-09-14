import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const COOKIE_CONSENT_NAME = "intell_cookie_preferences";

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="intell-gtm-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          (function(){
            var consent = { analytics: true, marketing: false };
            try {
              var match = document.cookie.match(new RegExp('(?:^|; )${COOKIE_CONSENT_NAME}=([^;]*)'));
              if (match) consent = JSON.parse(decodeURIComponent(match[1]));
            } catch (error) {}
            gtag('consent', 'default', {
              analytics_storage: consent.analytics ? 'granted' : 'denied',
              ad_storage: consent.marketing ? 'granted' : 'denied',
              ad_user_data: consent.marketing ? 'granted' : 'denied',
              ad_personalization: consent.marketing ? 'granted' : 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
          })();
        `}
      </Script>
      <Script id="intell-gtm-loader" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </>
  );
}
