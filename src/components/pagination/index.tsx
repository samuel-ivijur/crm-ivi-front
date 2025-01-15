import React from "react";
import * as Select from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number; // Página atual (começando de 1)
  limit: number;
  total: number;
  setPage: (newPage: number) => void;
  setLimit: (newLimit: number) => void;
}

export default function Pagination({ page, limit, total, setPage, setLimit }: PaginationProps) {
  const pageCount = Math.ceil(total / limit); // Calcula o total de páginas
  const range = 2; // Número de páginas ao redor da atual

  // Função para gerar a lista de páginas com reticências
  const generatePageNumbers = () => {
    const pages: Array<string | number> = [];

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 || // Primeira página
        i === pageCount || // Última página
        (i >= page - range && i <= page + range) // Páginas ao redor da atual
      ) {
        pages.push(i);
      } else if (
        (i === page - range - 1 || i === page + range + 1) && // Posição das reticências
        pages.filter((p) => p === "...").length < 2 // Limita a 2 reticências
      ) {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-end space-x-4">
      {/* Controle de Limite */}
      <div className="flex items-center space-x-2">
        <span>Limite:</span>
        <Select.Root value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
          <Select.Trigger className="inline-flex items-center justify-between border px-2 py-1 rounded-md w-20">
            <Select.Value />
          </Select.Trigger>
          <Select.Content className="border rounded-md shadow-md bg-white">
            <Select.Viewport>
              {[10, 20, 50, 100].map((value) => (
                <Select.Item
                  key={value}
                  value={String(value)}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                >
                  <Select.ItemText>{value}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Botões de Paginação */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(1)}
        disabled={page === 1}
      >
        {"<<"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </Button>

      {generatePageNumbers().map((p, index) => (
        <Button
          key={index}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => typeof p === "number" && setPage(p)}
          disabled={p === "..."}
        >
          {typeof p === "number" ? p : "..."}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
        disabled={page === pageCount}
      >
        Próxima
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(pageCount)}
        disabled={page === pageCount}
      >
        {">>"}
      </Button>
    </div>
  );
}
