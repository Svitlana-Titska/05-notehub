import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className={css.wrapper} aria-label="Pagination">
      <ReactPaginate
        className={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        previousClassName={css.pageItem}
        nextClassName={css.pageItem}
        previousLinkClassName={css.pageLink}
        nextLinkClassName={css.pageLink}
        activeClassName={css.active}
        disabledClassName={css.disabled}
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        pageCount={pageCount}
        forcePage={currentPage - 1}
        onPageChange={(e) => onPageChange(e.selected + 1)}
      />
    </nav>
  );
}
