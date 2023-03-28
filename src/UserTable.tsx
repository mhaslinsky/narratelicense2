import { Box, Flex, Table as Mtable, createStyles } from "@mantine/core";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { SortAscending, SortDescending } from "tabler-icons-react";
import React, { useState } from "react";
import { CombinedData } from "./types/types";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);
  // Store the itemRank info
  addMeta({ itemRank });
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const UserTable: React.FC<{ columns: any; loading: boolean; data: CombinedData[] }> = (props) => {
  const localStyles = createStyles((theme) => ({
    tHeader: {
      "&:hover": {
        cursor: "pointer",
      },
    },
  }));
  const { classes } = localStyles();

  const [sorting, setSorting] = useState<SortingState>([{ id: "Last name", desc: false }]);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    enableHiding: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Box
      sx={(theme) => ({
        flexGrow: 1,
        position: "relative",
        height: "100%",
      })}
    >
      <Mtable striped highlightOnHover withColumnBorders>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th colSpan={header.colSpan} key={header.id}>
                  {header.isPlaceholder ? null : (
                    <Flex align='center' gap='sm'>
                      <>
                        <div className={classes.tHeader} onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        {
                          { asc: <SortAscending size={18} />, desc: <SortDescending size={18} /> }[
                            header.column.getIsSorted() as string
                          ]
                        }
                      </>
                    </Flex>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </Mtable>
    </Box>
  );
};

export default UserTable;
