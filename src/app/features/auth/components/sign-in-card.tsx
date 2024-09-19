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

interface SignInCardProps {
  setState: (state: AuthFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="flex flex-col space-y-3">
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col space-y-3">
          <Button
            disabled={false}
            variant="ghost"
            size="lg"
            className="w-full relative"
            onClick={() => {}}
          >
            <FaGoogle className="absolute left-2.5 top-2.5 size-5" />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            variant="ghost"
            size="lg"
            className="w-full relative"
            onClick={() => {}}
          >
            <FaGithub className="absolute left-2.5 top-2.5 size-5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            className="text-sky-700 hover:underline cursor-pointer ml-1"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
