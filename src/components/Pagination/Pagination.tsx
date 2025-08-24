import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

// Додаємо керовану поточну сторінку
interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    currentPage: number; // 1-based із батьківського стану
}

/**
 * Керована пагінація: синхронізуємо виділення через forcePage (0-based).
 */
const Pagination = ({
    pageCount,
    onPageChange,
    currentPage,
}: PaginationProps) => {
    return (
        <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            forcePage={Math.max(0, (currentPage || 1) - 1)} // кероване виділення сторінки
            containerClassName={css.pagination}
            activeClassName={css.active}
            pageLinkClassName={css.pageLink}
            previousLinkClassName={css.pageLink}
            nextLinkClassName={css.pageLink}
            breakLinkClassName={css.pageLink}
        />
    );
};

export default Pagination;
