import React, { useEffect, useState } from 'react';
import {
    Pagination,
} from 'antd';

const TableFooterPagination = ({pagination, paginationChange}) => {
    const [first, setFirst] = useState(0);
    const [second, setSecond] = useState(0);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    useEffect(() => {
        let firstValue = ((pagination.per_page * pagination.current_page) + 1) - pagination.per_page;
        let secondValue = (firstValue + pagination.count) - 1;
        setFirst(firstValue ? firstValue : 1);
        setSecond(secondValue ? secondValue : 1)
        setTotal(pagination.total ? pagination.total : 1)
        setCount(pagination.count ? pagination.count : 1)
    }, [pagination]);

    useEffect(() => {
        return () => {
            setFirst(0);
            setSecond(0);
            setTotal(0);
        };
    }, []);
    return (
        <div className="flex justify-between mt-2">
            {
                count > 1 ? (
                    <span>
                        Showing {first} to {second}  of {total} entries
                    </span>
                ) : (
                    <span>
                        No results found
                    </span>
                )
            }
            <Pagination
                current={pagination?.current_page || 1}
                total={pagination?.total || 1}
                pageSize={pagination?.per_page || 1}
                onChange={paginationChange}
                showQuickJumper
                showSizeChanger={false}
                size="small"
            />
        </div>
    );
}

export default TableFooterPagination;
