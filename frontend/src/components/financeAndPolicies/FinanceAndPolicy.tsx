"use client"

import Accordion from "./Accordion"

export default function FinanceAndPolicy() {

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto mt-10 border border-gray-100">
            <h1 className="text-2xl font-semibold text-wonderleaf mb-4 text-center">
                Finances & Policies
            </h1>

            <p className="text-gray-700 text-md mb-3 leading-relaxed">
                <strong>
                    We ensure that the funds we raise are used appropriately, and we seek to be transparent and accountable with raising and spending funds.
                </strong>
            </p>

            <p className="text-gray-600 mb-6">
                Read more information in the FAQ section below:
            </p>

            <Accordion />
        </div>
    )
}