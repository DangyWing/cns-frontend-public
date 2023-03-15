import type { ColumnDef, FilterFn, OnChangeFn, SortingState, PaginationState } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { format, fromUnixTime } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { NameDetailsResult } from "../../types/types";
import { SendTxButton } from "../Buttons/SendTxButton";
import { useSetAsPrimaryName } from "../../hooks/useSetAsPrimaryName";
import { SendTxButtonConfirm } from "../Buttons/SendTxButtonConfirm";
import { LoadingIndicator } from "../LoadingIndicator";
import { TrashButton } from "../Buttons/TrashButton";
import type { RankingInfo } from "@tanstack/match-sorter-utils";
import { DebouncedInput } from "../DebouncedInput";
import { fuzzyFilter } from "../../utils/fuzzyFilter";
import { customBoxShadow } from "../../styles/customBoxShadow";
import { classNames } from "../../utils/classNames";
import { useClearPrimaryName } from "../../hooks/useClearPrimaryName";
import { CancelButton } from "../Buttons/CancelButton";

//todo: add the ability to renew a name

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export const RegisteredCNSTable = ({
  data,
  primaryName,
  pageIndex,
  pageSize,
  setPagination,
  walletBalance,
}: {
  data: NameDetailsResult[];
  primaryName: string | undefined;
  hasNextPage: boolean;
  pageIndex: number;
  pageSize: number;
  setPagination: (pagination: PaginationState) => void;
  walletBalance: number;
}) => {
  const [pendingPrimaryName, setPendingPrimaryName] = useState<string>();
  const [clearPrimaryName, setClearPrimaryName] = useState<boolean>();
  const columnHelper = createColumnHelper<NameDetailsResult>();
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { write, status, isLoadingWaitForSetPrimary, isLoading, reset, isSuccess } = useSetAsPrimaryName({
    name: pendingPrimaryName ?? "",
    enabled: !!pendingPrimaryName,
  });

  const {
    write: clearPrimaryNameWrite,
    isLoading: isLoadingClearPrimaryWrite,
    waitForTransaction: waitForTransactionClearPrimary,
    reset: resetClearPrimary,
  } = useClearPrimaryName({ enabled: true });

  const { isSuccess: isSuccessClearPrimary, isLoading: isLoadingWaitForClearPrimary } = waitForTransactionClearPrimary;

  useEffect(() => {
    if (isSuccess || status === "error" || isSuccessClearPrimary) {
      setPendingPrimaryName("");
      setClearPrimaryName(false);
      reset();
      resetClearPrimary();
    }
  }, [status, reset, isSuccess, isSuccessClearPrimary, resetClearPrimary]);

  function handleClickArrow(name: string) {
    setPendingPrimaryName(name);
  }

  function handleClearPrimaryName() {
    setClearPrimaryName(true);
  }

  const isLoadingSetPrimary = isLoading || isLoadingWaitForSetPrimary;
  const isLoadingClearPrimary = isLoadingClearPrimaryWrite || isLoadingWaitForClearPrimary;

  // todo: move out of this file
  const PrimaryNameDisplay = useCallback(
    ({ nameToDisplay, primaryName }: { nameToDisplay: string; primaryName: string | undefined }) => {
      const isPrimary = nameToDisplay === primaryName;
      const isPendingPrimaryName = nameToDisplay === pendingPrimaryName;
      const showSendTxButton = !isPrimary && !isPendingPrimaryName && !isLoading && !isSuccess;

      return (
        <div className="flex justify-center align-bottom">
          {showSendTxButton && <SendTxButton onClick={() => handleClickArrow(nameToDisplay)} />}

          {!isPrimary && pendingPrimaryName && !isLoadingSetPrimary && isPendingPrimaryName && (
            <div>
              <SendTxButtonConfirm onClick={() => write?.()} />
              <CancelButton onClick={() => setPendingPrimaryName("")} />
            </div>
          )}

          {isLoadingSetPrimary && isPendingPrimaryName && !isSuccess && <LoadingIndicator />}
        </div>
      );
    },
    [isLoading, isLoadingSetPrimary, isSuccess, pendingPrimaryName, write]
  );

  const columns = useMemo<ColumnDef<NameDetailsResult>[]>(
    () => [
      columnHelper.display({
        id: "primaryNameStatus",
        maxSize: 75,
        size: 75,
        minSize: 75,
        cell: (info) => {
          return <div className="flex justify-end px-2">{info.row.original.name === primaryName && <div>*</div>}</div>;
        },
      }),
      columnHelper.accessor("name", {
        header: "name",
        minSize: 400,
        size: 222,
        maxSize: 422,
        sortingFn: "alphanumeric",
        cell: (info) => {
          return <div className="mx-2 flex justify-start align-bottom">{info.getValue()}</div>;
        },
      }) as ColumnDef<NameDetailsResult, unknown>,
      columnHelper.group({
        header: "primary name",
        columns: [
          columnHelper.display({
            id: "setAsPrimary",
            header: "set",
            enableGlobalFilter: false,
            cell: (info) => {
              return <PrimaryNameDisplay nameToDisplay={info.row.original.name} primaryName={primaryName} />;
            },
          }),
          columnHelper.display({
            id: "clearPrimary",
            header: "clear",
            enableGlobalFilter: false,
            cell: (info) => {
              const isPrimary = info.row.original.name === primaryName;

              return (
                <div className="flex justify-center align-bottom">
                  {isPrimary && !clearPrimaryName && !isLoadingWaitForSetPrimary && (
                    <TrashButton onClick={() => handleClearPrimaryName()} />
                  )}
                  {isPrimary && clearPrimaryName && !isLoadingClearPrimary && (
                    <div>
                      <SendTxButtonConfirm onClick={() => clearPrimaryNameWrite?.()} />
                      <CancelButton onClick={() => setClearPrimaryName(false)} />
                    </div>
                  )}
                  {isLoadingClearPrimary && isPrimary && !isSuccessClearPrimary && <LoadingIndicator />}
                </div>
              );
            },
          }),
        ],
      }),

      columnHelper.accessor("expiry", {
        header: "name expiry",
        minSize: 275,
        size: 222,
        maxSize: 322,
        enableGlobalFilter: false,
        cell: (info) => {
          const formattedDate = format(fromUnixTime(Number(info.getValue()) ?? 0), "yyyy.MM.dd 'at' HH:mm zz");
          return <span className="flex justify-center text-sm text-cantoGreen">{formattedDate}</span>;
        },
      }) as ColumnDef<NameDetailsResult, unknown>,

      // todo: support querying delegateCash to get the current delegate status
      // todo: add the ability to delegate a name
      columnHelper.display({
        id: "renewName",
        header: () => {
          return (
            <div className="flex flex-col justify-center align-bottom text-gray-400">
              <div>renew</div>
              <div>-soon-</div>
            </div>
          );
        },
        enableGlobalFilter: false,
        cell: () => {
          return (
            <div className="text-color-gray-400 flex justify-center align-bottom">
              <CancelButton disabled={true} />
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "delegateName",
        header: () => {
          return (
            <div className="flex flex-col justify-center align-bottom text-gray-400">
              <div>delegate</div>
              <div>-soon-</div>
            </div>
          );
        },
        enableGlobalFilter: false,
        cell: () => {
          return (
            <div className="flex cursor-not-allowed justify-center align-bottom">
              <CancelButton disabled={true} />
            </div>
          );
        },
      }),
    ],
    [
      columnHelper,
      primaryName,
      PrimaryNameDisplay,
      clearPrimaryName,
      isLoadingWaitForSetPrimary,
      isLoadingClearPrimary,
      isSuccessClearPrimary,
      clearPrimaryNameWrite,
    ]
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const pageCount = Math.ceil(walletBalance / pageSize);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    onPaginationChange: setPagination as OnChangeFn<PaginationState>,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    autoResetPageIndex: false,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
  });

  return (
    <div className={customBoxShadow}>
      <DebouncedInput
        key="search"
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
        className={
          "my-2 flex rounded-none bg-gray-800 py-2 pr-2 text-center align-middle text-white placeholder-gray-400 focus:outline-none sm:text-sm "
        }
        debounce={100}
        placeholder="search"
      />

      <table className={classNames("w-full")}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <div className="mx-1">▲</div>,
                          desc: <div className="mx-1">▼</div>,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b-[1px] border-dashed">
              {/* using a temp fix for column sizing // https://github.com/TanStack/table/discussions/4179 */}
              {row.getVisibleCells()?.map((cell) => (
                <td className="py-2" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="gap 2 flex items-center">
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button className="rounded border p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};
