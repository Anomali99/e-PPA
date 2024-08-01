import React, { useState, useEffect } from "react";

export const Pagination: React.FC<{
  page: number;
  max: number;
  setCurrent: (value: number) => void;
}> = (props) => {
  if (props.max === 1 || props.max === 0) return null;
  const [page, setPage] = useState<number>(props.page);
  const [pages, setPages] = useState<(string | number | null)[]>([]);
  const [max, setMax] = useState<number>(props.max);
  const setCurrent = props.setCurrent;

  useEffect(() => {
    setPage(props.page);
    setMax(props.max);
    setPages(generatePages(props.page, props.max));
  }, [props.page, props.max]);

  const generatePages = (page: number, max: number) => {
    const page1 = page - 1;
    const page2 = page + 1;

    if (page === 1) {
      if (page2 === max) {
        return [1, max];
      }
      return [1, page2, "...", max];
    }

    if (page === max) {
      if (page1 === 1) {
        return [1, max];
      }
      return [1, "...", page1, max];
    }

    if (page1 === 1 && page2 === max) {
      return [page1, page, page2];
    }

    if (page1 === 1) {
      return [1, page, page2, "...", max];
    }

    if (page2 === max) {
      return [1, "...", page1, page, max];
    }

    if (page1 - 1 === 1) {
      return [1, page1, page, page2, "...", max];
    }

    if (page2 + 1 === max) {
      return [1, "...", page1, page, page2, max];
    }

    return [1, "...", page1, page, page2, "...", max];
  };

  if (max === 1) return null;

  return (
    <nav>
      <ul className="inline-flex -space-x-px text-xs md:text-sm">
        {page > 1 && (
          <li>
            <button
              onClick={() => setCurrent(page - 1)}
              className="flex items-center justify-center px-2 h-6 md:px-3 md:h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </button>
          </li>
        )}
        {pages.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => typeof item === "number" && setCurrent(item)}
              className={`flex items-center justify-center px-2 h-6 md:px-3 md:h-8 ${
                item === "..."
                  ? "leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  : page === item
                  ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                  : "leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              } `}
            >
              {item}
            </button>
          </li>
        ))}
        {page < max && (
          <li>
            <button
              onClick={() => setCurrent(page + 1)}
              className="flex items-center justify-center  px-2 h-6 md:px-3 md:h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
