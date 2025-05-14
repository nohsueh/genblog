"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPaginationRange } from "@/lib/utils";
import Link from "next/link";

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
                <Link href={`?page=${page}`}>
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
