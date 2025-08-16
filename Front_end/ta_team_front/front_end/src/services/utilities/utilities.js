 export const normalizeData = (data, idKey, nameKey) =>
    data.map((item) => ({ id: item[idKey], name: item[nameKey] }));