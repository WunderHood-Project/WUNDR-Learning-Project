"use client"

import TaxReturnForm from "../taxReturn/TaxReturnForm";
import { useState, useEffect } from "react"
import Link from "next/link"
import { BeatLoader } from "react-spinners"

export default function TaxReturnWaiver() {
    const [acknowledgementRequested, setAcknowledgementRequested] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLoadingStatus = () => {
            if (document.readyState == "complete") setLoading(false)
            else setLoading(true)
        }
        checkLoadingStatus()
    })


    return (
        <>
            {loading === true ?
                <div className="flex flex-col justify-center items-center h-screen">
                    <BeatLoader color="#90b35c" size={15} />
                </div> :

                <div className="flex flex-col mt-6 items-center h-full">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm w-full max-w-3xl p-5">
                        <div className="flex flex-row items-start">
                            <input
                                type="checkbox"
                                name="waiverRequest"
                                className="mt-1 h-5 w-5 text-amber-800 border-amber-400 rounded focus:ring-amber-600 transition duration-150 ease-in-out"
                                onChange={() => setAcknowledgementRequested(!acknowledgementRequested)}
                                aria-describedby="waiver-request"
                            />
                            <p className="ml-3 text-sm text-amber-900 leading-relaxed">
                                I agree to receive a donation/sponsorship acknowledgement from <strong>Wonderhood Project</strong>.
                                Skip this step by clicking the “Next” button below. <strong>Donors that skip this step will not receive a tax return acknowledgement.</strong>
                            </p>
                        </div>

                        <details open={acknowledgementRequested} className="mt-5 bg-white border border-amber-200 rounded-xl shadow-sm overflow-hidden">
                            <summary className="cursor-pointer select-none px-4 py-3 text-base font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition">
                                Read the Tax Return Acknowledgment policy and fill out the fields to receive an acknowledgement.
                            </summary>

                            <div className="px-5 pb-5 pt-3 text-sm text-amber-900 leading-relaxed space-y-3">
                                <p className="font-medium text-amber-950">
                                    By making a donation, you acknowledge the following:
                                </p>

                                <ol className="list-decimal list-inside space-y-2">
                                    <li>
                                        <strong>Purpose of the Gift:</strong> The funds you donate will be used by Wonderhood Project for its tax-exempt charitable purpose.
                                    </li>

                                    <li>
                                        <strong>No Goods or Services Exchanged:</strong> You will not receive any goods or services in exchange for your donation (or if you do receive something of value, the fair market value of that benefit will be disclosed and subtracted from your deductible contribution, as required by IRS rules).
                                    </li>

                                    <li>
                                        <strong>Tax Deductibility:</strong> Wonderhood Project is recognized under § 501(c)(3) of the Internal Revenue Code and therefore contributions may be tax-deductible for the donor to the extent permitted by law. You should consult your tax advisor for your specific situation.
                                    </li>

                                    <li>
                                        <strong>Use of a “1024 Waiver”:</strong> In certain circumstances, the IRS Form 1024 applies to organizations seeking recognition under § 501(a) other than § 501(c)(3). Please note that if Wonderhood Project is relying on such recognition (or has applied and is pending), the tax-deductibility of your donation may depend on final determination by the IRS.
                                    </li>

                                    <li>
                                        <strong>Limitations & Compliance:</strong> Donors should note that:
                                        <ul className="list-disc list-inside pl-4 space-y-1 mt-1">
                                            <li>The organization must operate in accordance with IRS rules for tax-exempt charities.</li>
                                            <li>Your donation will not be used for purposes outside the exempt mission.</li>
                                            <li>If you restrict your gift, we will attempt to honor that restriction, but may redirect it if impractical while staying aligned with our mission.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Record Keeping:</strong> You will receive an acknowledgement with the date and amount of your gift. Please retain it for your records.
                                    </li>

                                    <li>
                                        <strong>Refund Policy & Commitment:</strong> All donations are considered irrevocable once submitted. If you believe there is an error or wish to discuss your gift, please contact us at [contact info].
                                    </li>
                                </ol>

                                <p className="font-medium text-amber-950">Thank you again for your generous support of our mission!</p>

                                <div className="mt-5">
                                    <TaxReturnForm acknowledgementRequested={acknowledgementRequested} />
                                </div>
                            </div>
                        </details>

                        {acknowledgementRequested === false ?
                            <div className="mt-5">
                                <Link
                                    href={{ pathname: "/", query: { modal: "taxReturnSuccess" } }}
                                    className="border solid rounded py-1 px-2 bg-wonderleaf text-white"                                >
                                    Next
                                </Link>
                            </div>
                            : <div></div>
                        }
                    </div>
                </div>
            }
        </>
    )
}