import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Page } from "../components/Page";
import { CenteredContainer } from "../components/CenteredContainer";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Label } from "../components/Label";
import { SEO } from "../components/SEO";

export function PasswordResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("No reset token provided. Please request a new password reset link.");
      navigate("/signin");
    }
  }, [token, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      toast.error("No reset token provided");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/users/passwords/reset", {
        passwordToken: token,
        password: newPassword,
      });
      
      toast.success("Password has been reset successfully! You can now sign in with your new password.");
      navigate("/signin");
    } catch (error) {
      const message = error instanceof Error && error.response?.data?.message 
        ? error.response.data.message 
        : "Failed to reset password. The reset token may have expired.";
      toast.error(message);
      navigate("/signin");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Page>
        <SEO 
          page={null} 
          currentUrl={window.location.href}
          defaultTitle="Password Reset - ASUL Ultimate Website"
          defaultDescription="Reset your password"
          noIndex={true}
        />
        <CenteredContainer>
          <h1>Password Reset</h1>
          <p>No reset token provided. Please request a new password reset link.</p>
          <Button onClick={() => navigate("/signin")} fill="solid">
            Return to Sign In
          </Button>
        </CenteredContainer>
      </Page>
    );
  }

  return (
    <Page>
      <SEO 
        page={null} 
        currentUrl={window.location.href}
        defaultTitle="Password Reset - ASUL Ultimate Website"
        defaultDescription="Reset your password"
        noIndex={true}
      />
      <CenteredContainer>
        <h1>Reset Your Password</h1>
        <p>Enter your new password below.</p>
        
        <Form onSubmit={onSubmit}>
          <Label>
            New Password:
            <Input 
              name="newPassword" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </Label>

          <Label>
            Confirm New Password:
            <Input 
              name="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </Label>
          
          <Button type="submit" fill="solid" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>
      </CenteredContainer>
    </Page>
  );
}

export default PasswordResetPage;