import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

function Pagination({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={`mx-auto flex w-full justify-center ${className}`}
      {...props}
    />
  );
}

function PaginationContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={`flex flex-row items-center gap-1 ${className}`}
      {...props}
    />
  );
}

function PaginationItem({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={`${className}`} {...props} />;
}

interface PaginationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

function PaginationLink({
  className = "",
  isActive = false,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={`hover:bg-secondary inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${isActive ? "border border-gray-200 bg-white" : "bg-transparent hover:bg-gray-100"} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

function PaginationPrevious({ className = "", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="الانتقال إلى الصفحة السابقة"
      size="default"
      className={`gap-1 px-2.5 sm:pl-2.5 ${className}`}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="hidden sm:block">السابق</span>
    </PaginationLink>
  );
}

function PaginationNext({ className = "", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="الانتقال إلى الصفحة التالية"
      size="default"
      className={`gap-1 px-2.5 sm:pr-2.5 ${className}`}
      {...props}
    >
      <span className="hidden sm:block">التالي</span>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={`flex h-9 w-9 items-center justify-center ${className}`}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">المزيد من الصفحات</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
