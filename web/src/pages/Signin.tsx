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

export function SigninPage() {
  const { refetch } = useMe();
  const navigate = useNavigate();

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

  return (
    <Page>
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
      </CenteredContainer>
    </Page>
  );
}
