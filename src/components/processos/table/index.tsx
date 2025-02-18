'use client'

import {
  ColumnDef,
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
import { useCallback, useEffect, useState } from "react"
import { litigationTableColumns } from "./columns"
import { LitigationDataTableToolbar } from "./data-table-toolbar"
import { GetLitigations } from "@/services/api/litigations"
import { GetLitigationParams } from "@/hooks/useLitigations"
import Pagination from "@/components/pagination"
import { useLitigationActions } from "@/hooks/use-litigation-actions"
import { useRouter } from "next/navigation"

type LitigationTableProps = {
  data: {
    total: number;
    data: GetLitigations.LitigationInfo[];
    isLoading: boolean;
  }
  filter: GetLitigationParams
  changeFilter: (params: Partial<GetLitigationParams>) => void
}

export function LitigationTable({
  data,
  filter,
  changeFilter
}: LitigationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)
  const { changeMonitoring, deleteLitigation } = useLitigationActions()
  const router = useRouter()

  const selectAll = (data: GetLitigations.LitigationInfo[], checked: boolean) => {
    let newRowSelection = new Set(rowSelection)
    data.forEach((row) => {
      if (checked) newRowSelection.add(row.id)
      else newRowSelection.delete(row.id)
    })
    setRowSelection(newRowSelection)
  }

  const viewLitigation = (id: string) => {
    router.push(`/processos/${id}`)
  }

  const [columns, setColumns] = useState<ColumnDef<GetLitigations.LitigationInfo>[]>([])

  const PagePagination = () => (
    <Pagination
      limit={filter.limit || 20}
      page={filter.page || 1}
      setLimit={(limit) => changeFilter({ limit })}
      setPage={(page) => changeFilter({ page })}
      total={data.total || 0}
    />
  )

  const table = useReactTable<GetLitigations.LitigationInfo>({
    data: data.data || [],
    columns: columns,
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: filter.page || 1,
        pageSize: filter.limit || 20,
      },
    }
  })

  useEffect(() => {
    const isAllSelected = !data.data.some((row) => !rowSelection.has(row.id))
    setIsAllSelected(isAllSelected)
  }, [data.data, rowSelection])

  useEffect(() => {
    setColumns(litigationTableColumns({
      rowSelection,
      setRowSelection,
      selectAll,
      isAllSelected,
      data: data.data,
      changeMonitoring,
      deleteLitigation,
      viewLitigation
    }))
  }, [data.data, rowSelection, isAllSelected])

  return (
    <div className="space-y-4">
      <LitigationDataTableToolbar
        table={table}
        selectedRows={rowSelection}
        setSelectedRows={setRowSelection}
        isExporting={false}
        total={data.total || 0}
      />
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
          <TableBody loading={data.isLoading}>
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
          {table.getFilteredSelectedRowModel().rows.length} selecionado(s) | Total: {data.total}
        </div>
        <PagePagination />

      </div>
    </div>
  )
} 