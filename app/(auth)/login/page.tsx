import { LoginForm } from "./login-form";
import { getDictionary } from "@/lib/i18n/server";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const dict = await getDictionary();
  const callbackUrl =
    typeof searchParams?.callbackUrl === "string"
      ? searchParams.callbackUrl
      : undefined;

  return (
    <div className="space-y-8">
      <p className="text-center text-sm text-muted-foreground">
        {dict.auth.login.blurb}
      </p>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
