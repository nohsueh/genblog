"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { getBaseUrl, getPaginationRange } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalysesPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  language: string;
}

export function AnalysesPagination({
  currentPage,
  totalCount,
  pageSize,
  language,
}: AnalysesPaginationProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const pagePathname =
    pathname === new URL(getBaseUrl()).pathname
      ? pathname.split("/").slice(0, -1).join("/")
      : `${pathname}/page`;
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
                    pathname: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${pagePathname}/${page}`,
                    query: Object.fromEntries(searchParams.entries()),
                  }}
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
