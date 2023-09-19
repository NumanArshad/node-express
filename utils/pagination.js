const paginationQuery = (query, colums, defaultColumn = "id") => {
  let page = parseInt(query.page) || 1;
  let orderBy = query.sort ?? defaultColumn;
  let order = query.order ?? "asc";
  let limit = parseInt(query.limit) || 10;

  let searchColumn = colums.filter(({ columnName }) =>
    Object.keys(query).includes(columnName)
  );

  let searchQuery = searchColumn.length
    ? `where ${searchColumn.reduce((concatString, currentValue, index) => {
        let { columnName, type, queryColumn } = currentValue;
        queryColumn = queryColumn ?? columnName;
        if (index) concatString += " and ";
        const selectionQuery = type
          ? `= ${query[columnName]}`
          : `ilike '${query[columnName]}%'`;
        concatString += `${queryColumn} ${selectionQuery}`;
        return concatString;
      }, "")}`
    : "";

  return `${searchQuery} order by ${orderBy} ${order} limit ${limit} offset ${
    page - 1
  } `;
};

module.exports = paginationQuery;
