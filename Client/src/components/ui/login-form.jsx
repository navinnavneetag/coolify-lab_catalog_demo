import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth.service";
import TextLoader from "../text-loader/TextLoader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error,
      });
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <TextLoader text="Logging in..." />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-balance text-center text-3xl font-semibold text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        National Food Labs Database
      </div>
      <Card>
        <CardHeader className="text-center">
          <img src="/pngegg.png" alt="logo" className="h-10 w-16 self-center" />
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Login with your Email and Password</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="button" className="w-full" onClick={handleSubmit}>
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account ?{" "}
                <a href="#" className="text-primary">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{" "}
        <span className="text-primary hover:cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-primary hover:cursor-pointer">
          Privacy Policy
        </span>
      </div>
      <div className="flex gap-2 items-center justify-center text-md text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Powered by{" "}
        <img src="/Agnext_logo.png" alt="logo" className="h-6 w-32" />
      </div>
    </div>
  );
}
