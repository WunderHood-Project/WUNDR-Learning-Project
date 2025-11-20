const url = () => {
    if (process.env.NODE_ENV === "development")
        return "http://localhost:3000";
    return process.env.LIVE_URL;
};
const homeLink = url()

export const financeAndPoliciesData = [
    {
        title: "How do we raise funds?",
        content: "We are currently raising funds through grants and donor contributions."
    },
    {
        title: "Is Wonderhood Project a 501(c)(3) tax-exempt organization?",
        content: {
            text: "Yes, Wonderhood Project is a 501(c)(3) tax-exempt organization\n Find a copy of the 501(c)(3) approval letter from IRS: ",
            link: "/IRS_Tax_Exemption.pdf",
            label: "here"
        }
    },
    {
        title: "If I make a donation, will I receive an acknowledgement about the donation I made?",
        content: {
            text: "When making a donation via our online portal, you will be prompted to opt-in to receieve a tax return acknowledgement. You can make a donation: ",
            link: `${homeLink}/donate`,
            label: "here"
        }
    },
    {
        title: "Will I be able to see how funds are used at Wonderhood Project?",
        content: "Our goal is to be transparent and accountable with how we raise and spend funds.\n We will share a copy of the annual report and the IRS 990 Form here when available.",
    },
    {
        title: "What is Wonderhood Project's privacy policy?",
        content: {
            text: "Find our privacy policy: ",
            link: `${homeLink}/privacy-policy`,
            label: "here"
        }
    },

]