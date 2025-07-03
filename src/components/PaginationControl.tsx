import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const PaginationControl = ({ currentPage, pageCount, onPageChange }: PaginationControlProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(currentPage - 1, 1));
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            size="default"
          />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i + 1);
              }}
              isActive={currentPage === i + 1}
              size="default"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(currentPage + 1, pageCount));
            }}
            className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
            size="default"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
