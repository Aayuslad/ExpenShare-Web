import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import usersStore from "../stores/usersStore";
import { useFormik } from "formik";
import { verifyOTPValidation } from "../helper/inputValidation";

interface FormValues {
	OTP: string[];
}

export default function OtpVerificationPage(): React.JSX.Element {
	const store = usersStore();
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement[]>([]);

	const formik = useFormik<FormValues>({
		initialValues: {
			OTP: new Array(6).fill(""),
		},
		validate: verifyOTPValidation,
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: (values) => {
			store.verifyOtp(values, navigate);
		},
	});

	useEffect(() => {
		// focus first field if it is empty
		const firstInput = inputRef.current[0];
		if (firstInput && !firstInput.value) {
			firstInput.focus();
		}
	}, []);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
		// if it is number or space -> do not move
		if (isNaN(Number(e.target.value)) || e.target.value === " ") return;
		// adding values in formik
		formik.values.OTP[index] = e.target.value;
		// shifting focus on typing
		if (e.target.value && index < 5 && inputRef.current[index + 1]) {
			inputRef.current[index + 1].focus();
		}
	}

	// function to handle backspace
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
		if (e.key === "Backspace" && !e.currentTarget.value && inputRef.current[index - 1]) {
			inputRef.current[index - 1].focus();
		}
	}

	return (
		<div className="OtpVerificationPage">
			<div className="formContainer">
				<div className="pageTitle">
					<h2>OTP Verification</h2>
					<p>An email has been sent to {"var(email)"}. Enter below the 6 digit OTP</p>
				</div>

				<form className="OtpForm" onSubmit={formik.handleSubmit}>
					<div className="inputs">
						{formik.values.OTP.map((_, index) => (
							<input
								key={index}
								type="text"
								maxLength={1}
								inputMode="numeric"
								onChange={(e) => handleChange(e, index)}
								ref={(input) => (inputRef.current[index] = input as HTMLInputElement)}
								onKeyDown={(e) => handleKeyDown(e, index)}
							/>
						))}
					</div>

					<div className="resedOTP navigationText">
						{/* <button onClick={() => store.sendEmailVerificationMail({}, navigate)}>Resend OTP</button> */}
					</div>

					<button className="btn" type="submit">VERIFY</button>
				</form>

				<p className="navigationText">
					Move to{" "}
					<Link to="/login" className="link">
						Login Page
					</Link>
				</p>
			</div>
		</div>
	);
}
