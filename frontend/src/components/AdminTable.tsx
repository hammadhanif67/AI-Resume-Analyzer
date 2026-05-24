import type { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  rows: ReactNode[][];
}

export function AdminTable({ headers, rows }: AdminTableProps) {
  return (
    <div className="table-shell">
      <table className="w-full min-w-[760px] text-left">
        <thead className="table-head">
          <tr>{headers.map((header) => <th className="whitespace-nowrap px-4 py-3 text-left align-middle font-bold" key={header}>{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line bg-white">
          {rows.map((row, rowIndex) => (
            <tr className="transition-colors hover:bg-slate-50/90" key={rowIndex}>
              {row.map((cell, cellIndex) => <td className="table-cell" key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
