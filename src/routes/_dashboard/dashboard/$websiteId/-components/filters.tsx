import { Button, Link, Select, SelectItem, SelectSection } from "@heroui/react";
import { IoSettingsSharp } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";

import { Favicon } from "@/components/favicon";
import type { TWebsite } from "@/lib/types";
export const durationOptions = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_24_hours", label: "Last 24 hours" },
  { key: "last_7_days", label: "Last 7 days" },
  { key: "last_30_days", label: "Last 30 days" },
  { key: "last_12_months", label: "Last 12 months" },
  { key: "all_time", label: "All time" },
];

function Filters({
  websiteId,
  duration,
  setDuration,
  data,
  isLoading,
  refetchMain,
  refetchOthers,
  refetchGoals,
}: {
  websiteId: string;
  duration: string;
  // eslint-disable-next-line no-unused-vars
  setDuration: (duration: string) => void;
  data: TWebsite[];
  isLoading: boolean;
  refetchMain?: () => void;
  refetchOthers?: () => void;
  refetchGoals?: () => void;
}) {
  return (
    <div className="flex gap-4 items-end">
      <Select
        variant="flat"
        classNames={{
          trigger: "cursor-pointer gap-8 border-default border-medium",
          selectorIcon: "static",
          spinner: "static",
          value: "font-semibold text-lg",
          innerWrapper: "w-fit block",
          base: "w-fit",
          popoverContent: "w-fit border border-gray-600",
        }}
        placeholder="Select website"
        defaultSelectedKeys={[websiteId]}
        disallowEmptySelection
        labelPlacement="outside-left"
        selectorIcon={<SelectorIcon />}
        items={data}
        isLoading={isLoading}
        maxListboxHeight={400}
        renderValue={(items) =>
          items.map((item) => {
            return (
              <div
                className="font-semibold text-md flex items-center gap-2"
                key={item.textValue}
              >
                <Favicon domain={item.textValue as string} />
                {item.textValue}
              </div>
            );
          })
        }
      >
        <SelectSection showDivider>
          {data &&
            data.map((website) => (
              <SelectItem
                key={website.$id}
                textValue={website.domain}
                as={Link}
                href={`/dashboard/${website.$id}`}
              >
                <div className="font-semibold text-md flex items-center gap-2 whitespace-nowrap">
                  <Favicon domain={website.domain} />
                  {website.domain}
                </div>
              </SelectItem>
            ))}
        </SelectSection>
        <SelectSection className="p-0">
          <SelectItem
            key="setting"
            endContent={<IoSettingsSharp />}
            as={Link}
            href={`/dashboard/${websiteId}/settings?domain=${data ? data.find((w) => w.$id === websiteId)?.domain : ""}`}
          >
            Settings
          </SelectItem>
        </SelectSection>
      </Select>

      <Select
        classNames={{
          trigger: "border-default border-medium cursor-pointer",
          base: "max-w-3xs",
          value: "font-semibold text-md",
        }}
        placeholder="Duration"
        selectedKeys={[duration]}
        onSelectionChange={(keys) => {
          setDuration(Array.from(keys)[0] as string);
        }}
        labelPlacement="outside-left"
        disallowEmptySelection
      >
        {durationOptions.map((d) => (
          <SelectItem key={d.key}>{d.label}</SelectItem>
        ))}
      </Select>
      <Button
        isLoading={isLoading}
        onPress={() => {
          if (refetchMain) refetchMain();
          if (refetchOthers) refetchOthers();
          if (refetchGoals) refetchGoals();
        }}
        isIconOnly
        spinner={<TfiReload className="animate-spinner-ease-spin" />}
        variant="ghost"
        className="font-semibold shadow-md transition-all duration-200 hover:scale-105"
      >
        {!isLoading && <TfiReload />}
      </Button>
    </div>
  );
}

export const SelectorIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M8 9l4 -4l4 4" />
      <path d="M16 15l-4 4l-4 -4" />
    </svg>
  );
};
export default Filters;
