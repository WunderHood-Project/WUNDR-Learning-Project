// const url = () => {
//     if (process.env.NODE_ENV === "development")
//         return "http://localhost:3000/";
//     return "";
// };

// const homeLink = url()

const howToSignUp = () => {
    return (
        <>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Getting started is simple!
            </p>
            <ol className="list-decimal ml-6 mt-2 space-y-1 text-base sm:text-lg text-gray-700 leading-relaxed marker:text-wondergreen marker:font-bold">
                <li><span className="font-bold text-wondergreen">Create your WonderHood account.</span></li>
                <li><span className="font-bold text-wondergreen">Add your child(ren)</span> to complete their registration.</li>
                <li><span className="font-bold text-wondergreen">Choose an event and enroll.</span></li>
            </ol>
            <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
            Every WonderHood event is <span className="font-bold text-wondergreen">free to join.</span>
            </p>
        </>
    )
}

const policiesContent = () => (
  <>
    <p className="text-gray-700 leading-relaxed">
        Read our policies below:
    </p>

    <ul className="px-4 mt-1 space-y-2">
        <li>
            <a href="/privacy-policy"
                className="text-wonderleaf font-semibold underline hover:text-wonderleaf/80 transition"
            >
                Privacy Policy →
            </a>
        </li>
        <li>
            <a href="/child-protection-policy"
                className="text-wonderleaf font-semibold underline hover:text-wonderleaf/80 transition"
            >
                Child Protection Policy →
            </a>
        </li>
    </ul>
  </>
)

export const FAQ = [
    {
        title: "I'm interested in an event! How do I enroll?",
        content: howToSignUp
    },
    {
        title: "Insurance & waivers?",
        content: "We use parental waivers and follow venue safety requirements. We require background checks for all adult instructors and volunteers."
    },

    {
        title: "How do we raise funds?",
        content: "We are currently raising funds through grants and donor contributions. \nWe ensure that the funds we raise are used appropriately, and we seek to be transparent and accountable with raising and spending funds."
    },
    {
        title: "Is WonderHood Project a 501(c)(3) tax-exempt organization?",
        content: "Yes, WonderHood Project is a 501(c)(3) tax-exempt organization. That means your contribution is tax-deductible."
    },
    {
        title: "If I make a donation, will I receive an acknowledgement about the donation I made?",
        content: {
            text: "When donating through our online portal, you can opt in to receive a donation receipt for tax purposes. ",
            link: "/donate",
            label: "Donate Here →"
        }
    },
    {
        title: "Will I be able to see how WonderHood Project uses its funds?",
        content: "Yes. We are committed to being transparent and accountable with all donations. We will post our annual report and IRS Form 990 here as soon as they become available.",
    },
    {
        title: "What policies does WonderHood Project follow?",
        content: policiesContent
    },
    {
        title: "How can I get in touch with someone at WonderHood Project?",
        content: {
            text: "You can reach us anytime. Just submit your question, and our team will follow up. ",
            // link: `${homeLink}contact-us`,
            link: "/contact-us",
            label: "Contact Us →"
        }
    }

]
