import { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import ResetPassword from "./ResetPassword";

export default function ForgotFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <>
      {step === 1 && (
        <ForgotPassword
          onNext={(email) => {
            setEmail(email);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <VerifyOtp
          email={email}
          onVerified={(verifiedOtp) => {
            setOtp(otp);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <ResetPassword
            email={email}
            otp={otp}
            onNext={() => {
                alert("Password reset successful. Please login.");
                setStep(1); 
              }}
        />
)}
    </>
  );
}
