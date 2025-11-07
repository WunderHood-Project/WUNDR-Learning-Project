import TaxReturnForm from "./TaxReturnForm";
import { useState } from "react"

export default function TaxReturnWaiver() {
    const [acknowledgement, setAcknowledgement] = useState<boolean>(false)



    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="waiverRequest"
                    className="mt-1 h-4 w-4"
                    onChange={(e) => e.target.value}
                    aria-describedby="waiver-request"
                />
                <span>
                    I agree to receive a donation/sponsorship acknowledgement from Wonderhood Project
                </span>
            </label>
            <details>
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-bold text-amber-900">
                    Read the 1024-waiver policy and fill out the fields to recieve a tax return.
                </summary>
                <div className="px-3 pb-3 pt-1 text-sm leading-relaxed text-amber-900">
                    <div className="w-[50%]">
                        <p className="mb-2">
                            By making a donation, you acknowledge the following:
                        </p>
                        <p className="mb-2">
                            1. Purpose of the Gift. The funds you donate will be used by Wonderhood Project for its tax-exempt charitable purpose.
                        </p>

                        <p className="mb-2">
                            2. No Goods or Services Exchanged. You will not receive any goods or services in exchange for your donation (or if you do receive something of value, the fair market value of that benefit will be disclosed and subtracted from your deductible contribution, as required by IRS rules).
                        </p>

                        <p className="mb-2">
                            3. Tax Deductibility. Wonderhood Project is recognized under § 501(c)(3) of the Internal Revenue Code and therefore contributions may be tax-deductible for the donor to the extent permitted by law. You should consult your tax advisor for your specific situation.
                        </p>

                        <p className="mb-2">
                            4. Use of a “1024 Waiver.” In certain circumstances, the IRS Form 1024 (or references thereto) applies to organizations seeking recognition under § 501(a) other than § 501(c)(3). Please note: if [Your Organization Name] is relying on such a recognition (or has applied and is pending) then the tax-deductibility of your donation may depend on final determination by the IRS. [Tailor this clause depending on your status.]
                        </p>

                        <p className="mb-2">
                            5. Limitations & Compliance. Donors should note that:
                            • The organization is required to operate in accordance with IRS rules for tax-exempt charities, which include restrictions on political campaigning and private benefit.
                            • Your donation will not be used for purposes outside the exempt mission of the organization.
                            • If you direct the use of your gift (i.e., restrict it to a program or purpose), you must notify us and we will attempt to honor that restriction; however, if honoring your restriction becomes impossible or impractical, you agree that we may instead use the gift in a manner that is consistent with our exempt purpose.

                        </p>

                        <p className="mb-2">
                            6. Record Keeping. You will receive an acknowledgement from [Your Organization Name] with the date and amount of your gift. Please retain that acknowledgement for your records and for any tax-filing purposes.
                        </p>

                        <p className="mb-2">
                            7. Refund Policy & Commitment. All donations are considered irrevocable once submitted. If you believe there is an error or wish to discuss your gift, please contact us at [contact info].
                        </p>
                        <p className="mb-2">
                            Thank you again for your generous support of our mission!
                        </p>
                        <TaxReturnForm acknowledge={acknowledgement} />
                    </div>
                </div>
            </details >
        </div>
    )
}