import { redirect } from "next/navigation";

export default function Page() {
  redirect("/breakmonad/plinko"); // This runs immediately on the server
}
