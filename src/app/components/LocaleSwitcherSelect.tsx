"use client";

import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "../navigation";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <label
      className={[
        "relative",
        "text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30",
      ].join(" ")}
    >
      <p className="sr-only">{label}</p>
      <select
        className="inline-flex py-3 pl-2 pr-6 mx-2 shadow-md rounded-lg overflow-hidden max-w-sm p-2 text-center bg-black text-white border border-sky-600 border-opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition-colors duration-200"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
    </label>
  );
}
