import { redirect } from "next/navigation";

export default function AdminRedirect() {
  redirect("/dashboard?tab=admin-overview");
}
