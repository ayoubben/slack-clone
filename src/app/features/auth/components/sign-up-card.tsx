import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { AuthFlow } from "../types";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpCardProps {
  setState: (state: AuthFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);

    signIn("password", { name, email, password, passwordConfirm, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => setPending(false));
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-3">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="flex flex-col space-y-3" onSubmit={onPasswordSignUp}>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={pending}
            required
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col space-y-3">
          <Button
            disabled={pending}
            variant="ghost"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("google")}
          >
            <FaGoogle className="absolute left-2.5 top-2.5 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            variant="ghost"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("github")}
          >
            <FaGithub className="absolute left-2.5 top-2.5 size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <span
            className="text-sky-700 hover:underline cursor-pointer ml-1"
            onClick={() => setState("signIn")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
