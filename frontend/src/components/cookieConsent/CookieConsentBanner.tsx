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

        <CookieConsent
            cookieName="ga_cookie_consent"
            enableDeclineButton
            onDecline={() => {
                alert("Cookies Declined");
            }}
            declineButtonStyle={{ color: "white" }}
            declineButtonText="Decline"
            overlay
            location="bottom"
            buttonText="Accept"
            style={{ background: "#fdf6e9", color: "#2f5d3e", fontWeight: "bold", fontStyle: "italic", fontSize: "18px" }}
            buttonStyle={{ background: "#90b35c", color: "white", fontSize: "18px", borderStyle: "rounded" }}
            onAccept={acceptSelection}
        >
            <div className="space-y-3">
                <p>
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
            </div>
        </CookieConsent>
    )
}