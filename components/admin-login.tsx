"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateAdmin } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminLoginProps {
  lang: Locale;
  dictionary: any;
}

export function AdminLogin({ lang, dictionary }: AdminLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    toast.promise(validateAdmin(formData), {
      loading: dictionary.admin.login.loading,
      success: () => {
        router.push(`/${lang}/console/dashboard`);
        router.refresh();
        return dictionary.admin.login.success;
      },
      error: (error) => {
        console.error(error);
        return dictionary.admin.login.error;
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{dictionary.admin.login.title}</CardTitle>
          <CardDescription>
            {dictionary.admin.login.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={dictionary.admin.login.password}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? dictionary.admin.login.loading
                : dictionary.admin.login.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
