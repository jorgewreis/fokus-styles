import { DataTable } from "../../packages/fokus-js/js/fokus.js";

const tableEl = document.querySelector<HTMLElement>("[data-fs='datatable']")!;
const table = new DataTable(tableEl, { pageSize: 20 });
table.sort("name", "asc");
table.sort("name", "none");
table.filter("foo");

const pageCount: number = table.pageCount;
const rowCount: number = table.rowCount;
// @ts-expect-error Pagination counters are derived and read-only.
table.pageCount = 1;
// @ts-expect-error Pagination counters are derived and read-only.
table.rowCount = 1;

export { table, pageCount, rowCount };
