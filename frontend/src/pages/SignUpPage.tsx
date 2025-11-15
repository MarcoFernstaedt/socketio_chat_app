import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import {
    MessageCircleIcon,
    LockIcon,
    MailIcon,
    UserIcon,
    LoaderIcon,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

type SignupFormData = {
    fullname: string;
    email: string;
    password: string;
};

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState<SignupFormData>({
        fullname: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        signup(formData);
    };

    return (
        <div className="flex w-full items-center justify-center bg-slate-900 p-4">
            <div className="relative h-[650px] w-full max-w-6xl md:h-[800px]">
                <BorderAnimatedContainer>
                    <div className="flex w-full flex-col md:flex-row">
                        {/* FORM COLUMN - LEFT SIDE */}
                        <div className="flex items-center justify-center p-8 md:w-1/2 md:border-r border-slate-600/30">
                            <div className="w-full max-w-md">
                                {/* HEADING TEXT */}
                                <div className="mb-8 text-center">
                                    <MessageCircleIcon className="mb-4 h-12 w-12 mx-auto text-slate-400" />
                                    <h2 className="mb-2 text-2xl font-bold text-slate-200">
                                        Create Account
                                    </h2>
                                    <p className="text-slate-400">Sign up for a new account</p>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    {/* FULL NAME */}
                                    <div>
                                        <label
                                            htmlFor="fullname"
                                            className="auth-input-label"
                                        >
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <UserIcon className="auth-input-icon" />

                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="John Doe"
                                                autoComplete="name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* EMAIL INPUT */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="auth-input-label"
                                        >
                                            Email
                                        </label>
                                        <div className="relative">
                                            <MailIcon className="auth-input-icon" />

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="johndoe@gmail.com"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD INPUT */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="auth-input-label"
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <LockIcon className="auth-input-icon" />

                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Enter your password"
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <button
                                        className="auth-btn"
                                        type="submit"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? (
                                            <LoaderIcon className="h-5 w-full animate-spin text-center" />
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/login" className="auth-link">
                                        Already have an account? Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* FORM ILLUSTRATION - RIGHT SIDE */}
                        <div className="hidden items-center justify-center bg-gradient-to-bl from-slate-800/20 to-transparent p-6 md:flex md:w-1/2">
                            <div>
                                <img
                                    src="/signup.png"
                                    alt="People using mobile devices"
                                    className="h-auto w-full object-contain"
                                    loading="lazy"
                                />
                                <div className="mt-6 text-center">
                                    <h3 className="text-xl font-medium text-cyan-400">
                                        Start Your Journey Today
                                    </h3>

                                    <div className="mt-4 flex justify-center gap-4">
                                        <span className="auth-badge">Free</span>
                                        <span className="auth-badge">Easy Setup</span>
                                        <span className="auth-badge">Private</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
};

export default SignUpPage;