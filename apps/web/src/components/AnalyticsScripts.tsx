"use client";

import Script from "next/script";

// ── GA4 Measurement ID — yayına geçince buraya gir ──
// Google Analytics > Admin > Data Streams > Web Stream > Measurement ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

// ── Meta Pixel ID — yayına geçince buraya gir ──
// Meta Business Suite > Events Manager > Pixel ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "XXXXXXXXXXXXXXX";

export default function AnalyticsScripts() {
  return (
    <>
      {/* ── GA4: Consent Mode v2 başlangıç (her zaman yükle ama veri gönderme) ── */}
      <Script id="ga4-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          // Varsayılan olarak reddedilmiş — kullanıcı onaylayana kadar veri yok
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500,
          });

          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });

          // Onay verilince GA yükle
          window.loadGA = function() {
            const s = document.createElement('script');
            s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
            s.async = true;
            document.head.appendChild(s);
            s.onload = function() {
              gtag('consent', 'update', { analytics_storage: 'granted' });
              gtag('event', 'page_view');
            };
          };

          // Onay verilince Meta Pixel yükle
          window.loadMeta = function() {
            if (window.fbq) return;
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          };

          // Sayfa yüklenirken daha önce onay verilmişse otomatik başlat
          (function() {
            try {
              var consent = JSON.parse(localStorage.getItem('cookie_consent') || 'null');
              if (consent && consent.decided) {
                if (consent.analytics) window.loadGA();
                if (consent.marketing) window.loadMeta();
              }
            } catch(e) {}
          })();
        `}
      </Script>
    </>
  );
}
