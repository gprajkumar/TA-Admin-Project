import React, { useState, useEffect } from "react";
import Pagination from 'react-bootstrap/Pagination';
import "../AllRequirements.css";

const CustomPagination = ({paginationData, handlePageChange}) => {

  const paginatedItemGenerate = () => {
    let paginatedItems = [];
    const { totalpages, startpageitemno, endpageitemno, currentpage } = paginationData;

    if (totalpages <= 10) {
      for (let i = 2; i <= totalpages; i++) {
        paginatedItems.push(
          <Pagination.Item
            key={i}
            active={i === currentpage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      if (startpageitemno > 2) {
        paginatedItems.push(<Pagination.Ellipsis key="startellipsis" />);
      }

      for (let i = startpageitemno; i <= endpageitemno; i++) {
        if (i !== 1 && i !== totalpages) {
          paginatedItems.push(
            <Pagination.Item
              key={i}
              active={i === currentpage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      }

      if (endpageitemno < totalpages - 1) {
        paginatedItems.push(<Pagination.Ellipsis key="ellipsis" />);
      }

      if (endpageitemno < totalpages) {
        paginatedItems.push(
          <Pagination.Item
            key={totalpages}
            active={totalpages === currentpage}
            onClick={() => handlePageChange(totalpages)}
          >
            {totalpages}
          </Pagination.Item>
        );
      }
    }

    return paginatedItems;
  };

  return (
    <Pagination>
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={paginationData.currentpage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(Math.max(paginationData.currentpage - 1, 1))}
        disabled={paginationData.currentpage === 1}
      />
      <Pagination.Item
        key={1}
        active={1 === paginationData.currentpage}
        onClick={() => handlePageChange(1)}
      >
        {1}
      </Pagination.Item>
      {paginatedItemGenerate()}
      <Pagination.Next
        onClick={() =>
          handlePageChange(
            Math.min(paginationData.currentpage + 1, paginationData.totalpages)
          )
        }
        disabled={paginationData.currentpage === paginationData.totalpages}
      />
      <Pagination.Last
        onClick={() => handlePageChange(paginationData.totalpages)}
        disabled={paginationData.currentpage === paginationData.totalpages}
      />
    </Pagination>
    );
}

export default CustomPagination;
