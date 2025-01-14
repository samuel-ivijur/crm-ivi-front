'use client'

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { litigationTableColumns } from "./columns"
import { LitigationDataTableToolbar } from "./data-table-toolbar"
import { GetLitigations } from "@/services/api/litigations"
import { useLitigation } from "@/hooks/useLitigations"
import Pagination from "@/components/pagination"

export function LitigationTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { getAllLitigationsQuery, invalidateQuery, filter, setFilter } = useLitigation()

  const table = useReactTable<GetLitigations.LitigationInfo>({
    // data: Array.isArray(getAllLitigationsQuery.data) ? getAllLitigationsQuery.data : [],
    data: getAllLitigationsQuery.data?.data || [],
    columns: litigationTableColumns,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater({ pageIndex: filter.page, pageSize: filter.limit }) : updater;
      setFilter({ ...filter, page: newState.pageIndex, limit: newState.pageSize });
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: filter.page,
        pageSize: filter.limit,
      },
    }
  })

  const PagePagination = () => (
    <Pagination
      limit={filter.limit}
      page={filter.page}
      setLimit={(limit) => setFilter({ ...filter, limit })}
      setPage={(page) => setFilter({ ...filter, page })}
      total={getAllLitigationsQuery.data?.total || 0}
    />
  )

  return (
    <div className="space-y-4">
      <LitigationDataTableToolbar table={table} />
      <PagePagination />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody loading={getAllLitigationsQuery.isLoading}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={litigationTableColumns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} selecionado(s) | Total: {getAllLitigationsQuery.data?.total}
        </div>
        <PagePagination />

      </div>
    </div>
  )
} 