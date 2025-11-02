import { useModal } from "@/context/modal"
import React, { useState } from "react"
import { handleSignup, SignupPayload } from "../../../utils/auth";
import { formatUs, toE164US } from "../../../utils/formatPhoneNumber";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";
import { User } from "@/types/user";

type UserInfo = SignupPayload
type ParentNext = "now" | "later"

const SignupModal = () => {
    const { closeModal } = useModal()
    const { loginWithToken } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const nextParam = searchParams.get('next');
    const safeNext =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
        ? nextParam
        : pathname || '/';

    // State for errors, step, roles, child info, etc.
    const [serverError, setServerError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedRole, setSelectedRole] = useState<'parent' | 'volunteer' | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [creating, setCreating] = useState(false)

    // Form fields for each step
    const [form1, setForm1] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    })
    const [form2, setForm2] = useState({
        address: "",
        city: "",
        state: "",
        zipcode: ""
    })

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm1(prev => ({ ...prev, password: value }));

        // Check min 6 symbols
        if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else if (!/[A-Za-z]/.test(value)) {
            setPasswordError("Password must include at least one letter.");
        } else if (!/[0-9]/.test(value)) {
            setPasswordError("Password must include at least one number.");
        } else {
            setPasswordError(null);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setForm1(prev => ({ ...prev, phoneNumber: formatUs(value) }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name in form1) {
            setForm1(prev => ({ ...prev, [name]: value}))
        } else if (name in form2) {
            setForm2(prev => ({ ...prev, [name]: value}))
        }
        setServerError(null)
    }

    const createAccount = async (parentNext?: ParentNext) => {
        if (creating) return
        setServerError(null);

        const phoneE164 = toE164US(form1.phoneNumber)
        if (!phoneE164) {
            setServerError("Please enter a valid 10-digit US phone number")
            return
        }

        const zip = form2.zipcode.replace(/\D/g, '')
        if (zip.length !== 5) {
            setServerError("Please enter a valid 5-digit ZIP")
            return
        }
        setCreating(true)

        // Prepare user data
        const userInfo: UserInfo = {
            firstName: form1.firstName.trim(),
            lastName: form1.lastName.trim(),
            email: form1.email.trim().toLowerCase(),
            phoneNumber: phoneE164,
            password: form1.password,
            role: selectedRole as "parent" | "instructor",
            address: form2.address,
            city: form2.city,
            state: form2.state.trim().toUpperCase(),
            zipCode: zip
        };

        try {
            const response = await handleSignup(userInfo)
            await loginWithToken(response.token, response.user as User | undefined)

            let redirectTo = safeNext;
            if (selectedRole === "parent") {
                redirectTo = parentNext === 'now' ? "/profile?tab=child" : safeNext;
            }
            router.replace(redirectTo);
            closeModal();

        } catch (err) {
            setServerError("A network error occurred. Please try again later.");
            console.error(err);
        } finally {
            setCreating(false)
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!form1.firstName || !form1.lastName || !form1.email || !form1.password || !form1.confirmPassword) {
                setServerError("Please fill in all required fields.");
                return;
            }
            if (form1.password !== form1.confirmPassword) {
                setServerError("Passwords do not match.");
                return;
            }
            if (passwordError) {
                setServerError(passwordError);
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
        setServerError(null);
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setServerError(null);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (currentStep === 3 && selectedRole === 'volunteer') {
            createAccount()
            return
        }

        if (currentStep === 4 && selectedRole === 'parent') {
            createAccount("later")
            return
        }

        nextStep()
    }

    // Eye icon SVGs
    const EyeIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
    );

    return (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 text-green-600 w-full text-center">Join WonderHood</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Tell us about yourself</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={form1.firstName}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    maxLength={50}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={form1.lastName}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    maxLength={50}
                                />
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form1.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={100}
                            />

                            <input
                                type="tel"
                                name="phoneNumber"
                                inputMode="tel"
                                autoComplete="tel"
                                maxLength={12}
                                placeholder="Phone Number"
                                value={form1.phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form1.password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => setPasswordTouched(true)}
                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                    maxLength={32}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={form1.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                    maxLength={32}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            { passwordError && passwordTouched && (<div className="text-red-500 text-sm mt-1">{passwordError}</div>) }

                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Location */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Where are you located?</h3>
                            <p className="text-sm text-gray-600 mb-4">This program is currently available in the Westcliffe, Colorado area.</p>

                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={form2.address}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={50}
                            />

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form2.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={50}
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form2.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={2}
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{5}"
                                name="zipcode"
                                placeholder="ZIP Code"
                                value={form2.zipcode}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                maxLength={5}
                            />

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Role Selection */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">What brings you to WonderHood?</h3>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('parent')}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                        selectedRole === 'parent'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            selectedRole === 'parent' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'parent' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                                        </div>
                                        <div>
                                            <div className="font-medium">I&apos;m a Parent</div>
                                            <div className="text-sm text-gray-600">Looking for activities for my child</div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedRole('volunteer')}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                        selectedRole === 'volunteer'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            selectedRole === 'volunteer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                        }`}>
                                            {selectedRole === 'volunteer' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                                        </div>
                                        <div>
                                            <div className="font-medium">I&apos;m a Volunteer</div>
                                            <div className="text-sm text-gray-600">Want to help or earn service hours</div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type={selectedRole === 'volunteer' ? "submit" : "button"}
                                    onClick={selectedRole === 'volunteer' ? undefined : nextStep}
                                    disabled={!selectedRole || creating}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {selectedRole === 'volunteer' ? 'Create Account' : 'Continue'}
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && selectedRole === 'parent' && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-800">Almost there!</h3>
                            <p className="text-sm text-gray-600">
                                You can add your child&apos;s details now (about 2-3 minutes), or skip and do it later from your profile.
                                You&apos;ll need a child on file to join events.
                            </p>

                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => createAccount("now")}
                                    disabled={creating}
                                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Add a Child Now
                                    <div className="text-xs font-normal text-green-100">We&apos;ll create your account first.</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => createAccount("later")}
                                    disabled={creating}
                                    className="w-full bg-gray-100 text-gray-800 p-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Do This Later
                                    <div className="text-xs font-normal text-gray-500">Find it under Profile → Children.</div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Progress indicator */}
                    <div className="flex flex-col space-x-3 pt-4">
                        <div className="flex justify-center">
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            step <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default SignupModal
