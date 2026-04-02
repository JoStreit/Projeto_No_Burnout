"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search } from "lucide-react";

interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean;
  emptyText?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  disabled = false,
  error = false,
  emptyText = "Nenhum resultado encontrado.",
}: ComboboxProps) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selecionado = options.find((o) => o.value === value);

  const filtradas = options.filter((o) =>
    `${o.label} ${o.sublabel ?? ""}`.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirDropdown = useCallback(() => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = Math.min(280, filtradas.length * 36 + 52);
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setPos({
      top: openUpward ? rect.top + window.scrollY - dropdownHeight - 4 : rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setAberto(true);
    setBusca("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [disabled, filtradas.length]);

  const fechar = useCallback(() => {
    setAberto(false);
    setBusca("");
  }, []);

  const selecionar = useCallback(
    (opcao: ComboboxOption) => {
      onChange(opcao.value);
      fechar();
    },
    [onChange, fechar]
  );

  // Fecha ao clicar fora
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        fechar();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [aberto, fechar]);

  // Recalcula posição ao rolar/redimensionar
  useEffect(() => {
    if (!aberto) return;
    const update = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos((prev) => ({
        ...prev,
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      }));
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={aberto ? fechar : abrirDropdown}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-400" : "border-input hover:border-ring/50",
          !selecionado && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selecionado ? (
            <span className="flex items-center gap-2">
              <span className="font-medium text-foreground">{selecionado.label}</span>
              {selecionado.sublabel && (
                <span className="text-muted-foreground">{selecionado.sublabel}</span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            aberto && "rotate-180"
          )}
        />
      </button>

      {aberto &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 9999,
            }}
            className="rounded-lg border border-border bg-popover shadow-lg ring-1 ring-foreground/5"
          >
            {/* Campo de busca */}
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Lista */}
            <div className="max-h-56 overflow-y-auto p-1">
              {filtradas.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {emptyText}
                </p>
              ) : (
                filtradas.map((opcao) => (
                  <button
                    key={opcao.value}
                    type="button"
                    onClick={() => selecionar(opcao)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                      opcao.value === value && "bg-muted"
                    )}
                  >
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        opcao.value === value ? "opacity-100 text-emerald-600" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">{opcao.label}</span>
                    {opcao.sublabel && (
                      <span className="text-muted-foreground">{opcao.sublabel}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
