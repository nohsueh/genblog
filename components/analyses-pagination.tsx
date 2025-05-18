"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { i18n } from "@/lib/i18n-config";
import { getPaginationRange } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalysesPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export function AnalysesPagination({
  currentPage,
  totalCount,
  pageSize,
}: AnalysesPaginationProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return totalCount > pageSize ? (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          {getPaginationRange(
            currentPage,
            Math.ceil(totalCount / pageSize),
            isMobile ? 2 : 5,
          ).map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <Link
                  href={{
                    pathname: `${getPagePathname(pathname)}/${page}`,
                    query: Object.fromEntries(searchParams.entries()),
                  }}
                  passHref
                >
                  <PaginationLink isActive={currentPage === page}>
                    {page}
                  </PaginationLink>
                </Link>
              </PaginationItem>
            ),
          )}
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;
}

function getPagePathname(pathname: string) {
  const segements = pathname.split("/");
  if (segements.length === 2 && segements[0] === "" && segements[1] === "") {
    return `${pathname}${i18n.defaultLocale}/page`;
  }
  if (
    segements.length === 2 &&
    segements[0] === "" &&
    i18n.locales.includes(segements[1])
  ) {
    return `${pathname}/page`;
  }
  if (
    segements.length === 4 &&
    segements[0] === "" &&
    i18n.locales.includes(segements[1]) &&
    segements[2] === "tag"
  ) {
    return pathname;
  }
  return segements.slice(0, -1).join("/");
}
