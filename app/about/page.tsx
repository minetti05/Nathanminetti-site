import { InProgress } from "@/components/InProgress";
export const metadata = { title: "About" };
export default function Page() {
  return <InProgress title="About" stage={4} />;
}
