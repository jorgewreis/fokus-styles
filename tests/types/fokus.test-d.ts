// Verificado por `npm run types:check` (tsc --noEmit) — não é executado em
// runtime, só garante que os .d.ts em packages/fokus-js/js/ tipam
// corretamente um uso real da API pública.
import { Modal, Dropdown, DataTable, confirm, core } from "../../packages/fokus-js/js/fokus.js";

const triggerEl = document.querySelector<HTMLElement>("[data-fs-target]")!;

const modal = new Modal(triggerEl, { backdrop: "static" });
modal.show();
modal.hide();
const sameModal: Modal | undefined = Modal.getInstance(triggerEl);

const dropdown = new Dropdown(triggerEl, { placement: "bottom", align: "start" });
dropdown.toggle();

const tableEl = document.querySelector<HTMLElement>("[data-fs='datatable']")!;
const table = new DataTable(tableEl, { pageSize: 20 });
table.sort("name", "asc");
table.filter("foo");

confirm({ title: "Tem certeza?", variant: "danger" }).then((confirmed: boolean) => confirmed);

const position = core.computePosition(triggerEl, document.createElement("div"), { placement: "top" });
core.applyPosition(document.createElement("div"), position);

export { modal, dropdown, table, sameModal };
