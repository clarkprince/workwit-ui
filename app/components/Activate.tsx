"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";

const FORTNOX_AUTH_URL = "https://apps.fortnox.se/oauth-v1/auth?client_id=KGtuCBfCxWhA&scope=companyinformation article order invoice customer&state=workwit&access_type=offline&response_type=code";

const Activate: React.FC = () => {
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      window.location.href = FORTNOX_AUTH_URL;
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_ENDPOINTS.tenants}/activate?code=${code}&domain=${domain}&apikey=${apiKey}`);
      if (!response.ok) throw new Error("Activation failed");
      toast.success("Successfully activated");
    } catch (error) {
      toast.error("Failed to activate: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (!code) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 mt-[-10%]">
        <CardHeader>
          <CardTitle>Synchroteam Settings</CardTitle>
          <CardDescription>Enter your Synchroteam credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input type="text" placeholder="Synchroteam Domain" value={domain} onChange={(e) => setDomain(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Input type="text" placeholder="Synchroteam API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activate;
