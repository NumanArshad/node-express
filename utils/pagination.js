const paginationQuery = (query, colums) => {
  let page = parseInt(query.page) || 1;
  let orderBy = query.sort ?? "id";
  let order = query.order ?? "asc";
  let limit = parseInt(query.limit) || 10;

  let searchColumn = Object.keys(query).find((columnName) =>
    colums.includes(columnName)
  );

  let searchQuery = searchColumn
    ? `where ${searchColumn} like '${query[searchColumn]}%'`
    : "";

  return `${searchQuery} order by ${orderBy} ${order} limit ${limit} offset ${
    page - 1
  } `;
};

module.exports = paginationQuery;
