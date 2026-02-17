"use client"

import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { useEffect, useState } from "react";

export default function CookieConsentBanner() {
    const [analytics, setAnalytics] = useState(false)
    const [ads, setAds] = useState(false)

    useEffect(() => {
        window.gtag?.("consent", "update", {
            analytics_storage: getCookieConsentValue("analytics_consent") === "true" ? "granted" : "denied",
            ad_storage: getCookieConsentValue("ads_consent") === "true" ? "granted" : "denied",
        });
    }, []);

    const acceptSelection = () => {
        window.gtag?.("consent", "update", {
            analytics_storage: analytics ? "granted" : "denied",
            ad_storage: ads ? "granted" : "denied",
            ad_user_data: ads ? "granted" : "denied",
            ad_personalization: ads ? "granted" : "denied",
        });
    };

    return (
        <div className="space-y-3">
            <CookieConsent
                cookieName="ga_cookie_consent"
                enableDeclineButton
                onDecline={() => {
                    alert("Cookies Declined");
                }}
                declineButtonStyle={{ color: "white", borderRadius: "9999px", background: "#A52A2A", paddingInline: "30px" }}
                declineButtonText="Decline"
                overlay
                location="bottom"
                buttonText="Accept"
                style={{ background: "#fdf6e9", color: "#2f5d3e", fontWeight: "bold", fontSize: "20px", paddingInline: "80px", display: "flex", alignItems: "center", marginTop: "25px", justifyContent: "center" }}
                buttonStyle={{ background: "#90b35c", color: "white", fontSize: "20px", borderRadius: "9999px", paddingInline: "30px" }}
                onAccept={acceptSelection}
                buttonWrapperClasses="
                 flex 
                 justify-center 
                 items-center 
                 gap-3 
                 w-full
                 mb-3
              "
            >
                <p className="xs:mb-6 lg:mb-2">
                    We use cookies to improve the site. You can choose which cookies you
                    allow.
                </p>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                    />
                    <span>Analytics cookies</span>
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={ads}
                        onChange={(e) => setAds(e.target.checked)}
                    />
                    <span>Advertising cookies</span>
                </label>
            </CookieConsent>
        </div>
    )
}