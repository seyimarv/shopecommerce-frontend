"use client";

import { clsx } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({
  totalPages,
  "data-testid": dataTestid,
}: {
  totalPages: number;
  "data-testid"?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const p = searchParams.get("page") || "1";

  const page = parseInt(p, 10);

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clsx(
        "px-3 py-1 rounded-md text-md font-medium cursor-pointer",
        isCurrent
          ? "bg-secondary text-gray-800 cursor-default"
          : "text-gray-700 hover:bg-gray-200"
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
      aria-current={isCurrent ? "page" : undefined}
    >
      {label}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span key={key} className="px-2 text-gray-500">
      ...
    </span>
  );

  const renderPageButtons = () => {
    const buttons: JSX.Element[] = [];

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      );
    } else {
      if (page <= 4) {
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        );
        buttons.push(renderEllipsis("ellipsis1"));
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        );
      } else if (page >= totalPages - 3) {
        buttons.push(renderPageButton(1, 1, 1 === page));
        buttons.push(renderEllipsis("ellipsis2"));
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        );
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page));
        buttons.push(renderEllipsis("ellipsis3"));
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        );
        buttons.push(renderEllipsis("ellipsis4"));
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        );
      }
    }

    return buttons;
  };

  if (!totalPages || totalPages <= 1) {
    return;
  }

  return (
    <nav
      className="flex justify-center items-center gap-2 pt-12"
      aria-label="Pagination"
      data-testid={dataTestid}
    >
      <button
        className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        aria-label="Previous Page"
      >
        Prev
      </button>
      {renderPageButtons()}
      <button
        className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200 cursor-pointer"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        aria-label="Next Page"
      >
        Next
      </button>
    </nav>
  );
}
