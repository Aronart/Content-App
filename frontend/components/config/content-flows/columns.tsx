'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContentFlow } from '@/types/generated';

export const columns: ColumnDef<ContentFlow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'source_config_id',
    header: 'Source',
  },
  {
    accessorKey: 'editing_pipeline_id',
    header: 'Pipeline',
  },
  {
    accessorKey: 'destination_account_id',
    header: 'Destination',
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <span className={row.original.is_active ? 'text-green-600' : 'text-red-600'}>
        {row.original.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const contentFlow = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contentFlow.id.toString())}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Flow</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete Flow</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
