import LinkComponent from "@/components/link";
import type { TWebsite } from "@/lib/types";
import { Alert } from "@heroui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";

export default function WaitForFirstEvent({
  websiteId,
  currentWebsite,
}: {
  websiteId: string;
  currentWebsite?: TWebsite | null;
}) {
  return (
    <Alert
      color="warning"
      icon={<FiAlertTriangle />}
      hideIcon
      className="dark:bg-[#312107]  border-warning border text-sm fixed bottom-5 left-5 w-fit __className_23ba4a z-50 text-warning-600"
    >
      <div className="flex gap-3">
        <GoAlertFill className="mt-1 text-black" fill="#eab308" />
        <ul>
          <li className="flex gap-2 font-medium text-warning-900">
            Awaiting the first event...
            <span
              role="status"
              aria-label="Loading"
              className="inline-block w-3 h-3 rounded-full  border mt- border-current border-t-transparent animate-spin  "
            />
          </li>
          <ol className="list-decimal list-inside ">
            <li className="flex">
              Install the script using the{" "}
              <LinkComponent
                text="tracking code"
                href={`/dashboard/${websiteId}/settings`}
                blank
              />
            </li>
            <li>
              Visit{" "}
              <LinkComponent
                text={currentWebsite ? currentWebsite.domain : ""}
                blank
                href={`https://${currentWebsite ? currentWebsite.domain : ""}`}
              />
              to register the first event yourself
            </li>
            <li>Refresh your dashboard</li>
            <li>
              Still not working?{" "}
              <LinkComponent
                text="Contact support"
                href="https://x.com/sahil_builds"
              />
            </li>
          </ol>
        </ul>
      </div>
    </Alert>
  );
}
