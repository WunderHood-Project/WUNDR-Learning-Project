"use client"

import Accordion from "./Accordion"

export default function FinancesFAQ() {

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto mt-10 border border-gray-100">
            <h1 className="text-2xl font-semibold text-wonderleaf mb-4 text-center">
                Frequently Asked Questions
            </h1>

            <p className="text-gray-700 text-md text-center mb-6 leading-relaxed">
                Read more information in the FAQ section below:
            </p>

            <Accordion />
        </div>
    )
}
