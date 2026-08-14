import { Page } from "../components/Page";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { CenteredContainer } from "../components/CenteredContainer";
import { Label } from "../components/Label";
import { useMe } from "../hooks/me.hook";
import { useNavigate } from "react-router";
import { SEO } from "../components/SEO";
import { useState } from "react";

export function SigninPage() {
  const { refetch } = useMe();
  const navigate = useNavigate();
  const [isRequestingReset, setIsRequestingReset] = useState(false);

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await axios.post("/api/users/tokens", {
        email,
        password,
      });
      navigate("/");
      refetch();
    } catch (error) {
      toast.error("Invalid email or password");
    }
  }

  async function onRequestPasswordReset(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (!email || typeof email !== "string") {
      toast.error("Please enter your email address");
      return;
    }

    setIsRequestingReset(true);
    try {
      await axios.post("/api/users/tokens/reset", {
        email,
      });
      toast.success(
        "If an account exists with this email, a password reset link has been sent. Check your email (or terminal logs for the reset token).",
      );
    } catch (error) {
      toast.error("Failed to request password reset. Please try again.");
    } finally {
      setIsRequestingReset(false);
    }
  }

  return (
    <Page>
      <SEO
        page={null}
        currentUrl={window.location.href}
        defaultTitle="Sign In - ASUL Ultimate Website"
        defaultDescription="Sign in to access the page editor and manage your MDX content"
        noIndex={true}
      />
      <CenteredContainer>
        <h1>Sign in</h1>
        <p>You can sign in to edit website content</p>

        <Form onSubmit={onSubmit}>
          <Label>
            Email:
            <Input name="email" />
          </Label>

          <Label>
            Password:
            <Input name="password" type="password" />
          </Label>
          <Button type="submit" fill="solid">
            Sign in
          </Button>
        </Form>

        <hr style={{ margin: "20px 0" }} />

        <h2>Forgot Password?</h2>
        <p>Enter your email to receive a password reset link.</p>

        <Form onSubmit={onRequestPasswordReset}>
          <Label>
            Email:
            <Input name="email" type="email" />
          </Label>
          <Button type="submit" fill="solid" disabled={isRequestingReset}>
            {isRequestingReset ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>
      </CenteredContainer>
    </Page>
  );
}
