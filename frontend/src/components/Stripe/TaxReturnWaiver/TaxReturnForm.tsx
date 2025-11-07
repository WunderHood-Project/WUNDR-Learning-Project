import { useState } from "react"

type Props = {
    acknowledge: boolean
}

const TaxReturnForm: React.FC<Props> = ({ acknowledge }) => {

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    return (
        <div>
            {acknowledge ?


                <form>
                    <div>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={e => e.target}
                            className="border rounded-md p-2 w-32"
                            placeholder="First Name"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={e => e.target}
                            className="border rounded-md p-2 w-32"
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <input
                            type="telephone"
                            name="phoneNumber"
                            value={phone}
                            onChange={e => e.target}
                            className="border rounded-md p-2 w-32"
                            placeholder="Phone Number"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => e.target}
                            className="border rounded-md p-2 w-32"
                            placeholder="example@example.com"
                        />
                    </div>

                    <button type="submit">

                    </button>
                </form>
                :
                <div>

                </div>
            }

        </div>
    )
}

export default TaxReturnForm