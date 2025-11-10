import { useState } from "react"
import { CreateTaxReturnPayload, TaxReturnErrors } from "@/types/taxReturn"
import { makeApiRequest } from "../../../utils/api"
import { determineEnv } from "../../../utils/api"

type Props = {
    acknowledge: boolean
}

const WONDERHOOD_URL = determineEnv()

const TaxReturnForm: React.FC<Props> = ({ acknowledge }) => {

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [errors, setErrors] = useState<TaxReturnErrors>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const validationErrors: TaxReturnErrors = {}

        // Add validations here
        if (!firstName) validationErrors.firstName = "Please provide a first name"
        if (!lastName) validationErrors.lastName = "Please provide a last name"
        if (!email) validationErrors.email = "Please provide an email"
        if (!phone) validationErrors.phone = "Please provide a phone number"


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        // Handle submit logic here
        const payload: CreateTaxReturnPayload = {
            firstName,
            lastName,
            email,
            phone
        }

        const response = await makeApiRequest(`${WONDERHOOD_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        }) as Response

        if (!response.ok) {
            throw new Error(`Failed to record tax return credentials`)
        }

        const data = await response.json();

    }

    return (
        <div>
            {acknowledge ?
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="border rounded-md p-2 w-[25%]"
                            placeholder="First Name"
                        />

                    </div>
                    <div>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="border rounded-md p-2 w-[25%]"
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <input
                            type="telephone"
                            name="phoneNumber"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="border rounded-md p-2 w-[25%]"
                            placeholder="Phone Number"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="border rounded-md p-2 w-[25%]"
                            placeholder="example@example.com"
                        />
                    </div>

                    <button
                        className="border solid rounded py-1 px-2 bg-wonderleaf text-white"
                        type="submit"
                    // onClick={""}
                    >
                        Next
                    </button>
                </form>
                :
                <div>
                    <button
                        className="border solid rounded py-1 px-2 bg-wonderleaf text-white"
                    >
                        Next
                    </button>
                </div>
            }

        </div>
    )
}

export default TaxReturnForm