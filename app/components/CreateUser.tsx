"use client";

import React, { useState } from "react";
import { createUser } from "@/services/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CreateUser: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    tenant: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast.success("User created successfully");
      router.replace("/login");
    } catch (error) {
      // More specific error handling
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage, {
        description: "Please check your input and try again",
        duration: 5000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 mt-[-5%]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Enter your details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="tenant" placeholder="Synchroteam Domain" value={formData.tenant} onChange={handleChange} required />
            <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={8} />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-sky-600">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
