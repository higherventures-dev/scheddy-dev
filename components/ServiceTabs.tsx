"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { CategoryList } from "./ServicesList";

export function ServiceTabs({ categories }) {
  const [tab, setTab] = useState("services");

  return (
    <Tabs defaultValue="services" onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="services">
        <CategoryList categories={categories} />
      </TabsContent>
      <TabsContent value="categories">
        {/* Future Category management UI */}
      </TabsContent>
    </Tabs>
  );
}