"use client";

import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "../../../../../auth/component";
import { useAdmin } from "../hooks/useAdmin";

const AdminLogin = () => {
  const { isPending, handleFormSubmit, formData, setFormData } = useAdmin();

  return (
    <AuthPageContainer>
      <FormContainer>
        <AuthPageCaption>Admin Login</AuthPageCaption>
        <form
          onSubmit={handleFormSubmit}
          id="body"
          className="mb-4 flex w-full flex-col items-center justify-center gap-8"
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Input
              name="email"
              required
              autoComplete="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            >
              Email
            </Input>

            <Input
              name="password"
              required
              minLength={8}
              autoComplete="current-password"
              type="password"
              placeholder="Password (mininum at least 8 characters)"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            >
              Password
            </Input>
          </div>

          <Button loading={isPending}>Login</Button>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default AdminLogin;
