"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addInvoiceItem,
  issueInvoice,
  removeInvoiceItem,
  updateInvoiceDraft,
  updateInvoiceItem,
} from "../api";
import { fromMoney, toMoney } from "../lib/money";
import { recomputeInvoiceTotals } from "../lib/calculations";
import { toast } from "@/components/ui/toast";
import type {
  AddInvoiceItemInput,
  InvoiceWithItems,
  SchemeOptionCode,
} from "../types";

function schemeCodeFromOption(code: SchemeOptionCode): string | null {
  if (code === "self_pay") return null;
  if (code === "PM-JAY") return "PM-JAY";
  return "OTHER";
}

function optionFromSchemeCode(scheme_code: string | null): SchemeOptionCode {
  if (scheme_code === "PM-JAY") return "PM-JAY";
  if (scheme_code === "OTHER") return "OTHER";
  return "self_pay";
}

export function useInvoiceEditor(
  invoice: InvoiceWithItems | null,
  onSaved?: (next: InvoiceWithItems) => void,
) {
  const [draft, setDraft] = useState<InvoiceWithItems | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setDraft(invoice ? structuredClone(invoice) : null);
    setPreviewOpen(false);
  }, [invoice]);

  const canEdit = draft?.status === "draft";
  const schemeOption = optionFromSchemeCode(draft?.scheme_code ?? null);

  const isDirty = useMemo(() => {
    if (!invoice || !draft) return false;
    return JSON.stringify(invoice) !== JSON.stringify(draft);
  }, [invoice, draft]);

  const applyTotals = useCallback((next: InvoiceWithItems): InvoiceWithItems => {
    const totals = recomputeInvoiceTotals(
      next.items,
      next.discount_amount,
      next.scheme_adjustment,
    );
    return { ...next, ...totals };
  }, []);

  const setScheme = useCallback(
    (option: SchemeOptionCode) => {
      if (!draft || !canEdit) return;
      setDraft(
        applyTotals({
          ...draft,
          scheme_code: schemeCodeFromOption(option),
          // Keep existing scheme_adjustment; user edits it explicitly (no auto %).
          scheme_adjustment: draft.scheme_adjustment,
        }),
      );
    },
    [applyTotals, canEdit, draft],
  );

  const setDiscount = useCallback(
    (discount_amount: number) => {
      if (!draft || !canEdit) return;
      setDraft(applyTotals({ ...draft, discount_amount: toMoney(Math.max(0, discount_amount)) }));
    },
    [applyTotals, canEdit, draft],
  );

  const setSchemeAdjustment = useCallback(
    (scheme_adjustment: number) => {
      if (!draft || !canEdit) return;
      setDraft(
        applyTotals({
          ...draft,
          scheme_adjustment: toMoney(Math.max(0, scheme_adjustment)),
        }),
      );
    },
    [applyTotals, canEdit, draft],
  );

  const saveDraft = useCallback(async () => {
    if (!draft || !canEdit) return;
    setBusy(true);
    try {
      const saved = await updateInvoiceDraft(draft.id, {
        scheme_code: draft.scheme_code,
        discount_amount: draft.discount_amount,
        scheme_adjustment: draft.scheme_adjustment,
      });
      setDraft(saved);
      onSaved?.(saved);
      toast.success("Draft saved", saved.invoice_number);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }, [canEdit, draft, onSaved]);

  const issue = useCallback(async () => {
    if (!draft || !canEdit) return;
    setBusy(true);
    try {
      await updateInvoiceDraft(draft.id, {
        scheme_code: draft.scheme_code,
        discount_amount: draft.discount_amount,
        scheme_adjustment: draft.scheme_adjustment,
      });
      const issued = await issueInvoice(draft.id);
      setDraft(issued);
      onSaved?.(issued);
      toast.success("Invoice issued", "Financial fields are now frozen");
      setPreviewOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Issue failed");
    } finally {
      setBusy(false);
    }
  }, [canEdit, draft, onSaved]);

  const addItem = useCallback(
    async (body: AddInvoiceItemInput) => {
      if (!draft || !canEdit) return;
      setBusy(true);
      try {
        const next = await addInvoiceItem(draft.id, body);
        setDraft(next);
        onSaved?.(next);
        toast.success("Line added", body.description);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not add item");
      } finally {
        setBusy(false);
      }
    },
    [canEdit, draft, onSaved],
  );

  const patchItem = useCallback(
    async (
      itemId: string,
      patch: Partial<
        Pick<AddInvoiceItemInput, "quantity" | "unit_price" | "description" | "charge_category">
      >,
    ) => {
      if (!draft || !canEdit) return;
      setBusy(true);
      try {
        const next = await updateInvoiceItem(draft.id, itemId, patch);
        setDraft(next);
        onSaved?.(next);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not update item");
      } finally {
        setBusy(false);
      }
    },
    [canEdit, draft, onSaved],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!draft || !canEdit) return;
      setBusy(true);
      try {
        const next = await removeInvoiceItem(draft.id, itemId);
        setDraft(next);
        onSaved?.(next);
        toast.info("Line removed");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not remove item");
      } finally {
        setBusy(false);
      }
    },
    [canEdit, draft, onSaved],
  );

  return {
    draft,
    canEdit,
    busy,
    isDirty,
    schemeOption,
    previewOpen,
    setPreviewOpen,
    setScheme,
    setDiscount,
    setSchemeAdjustment,
    saveDraft,
    issue,
    addItem,
    patchItem,
    removeItem,
    /** Numeric helpers for controlled inputs */
    discountNumber: draft ? fromMoney(draft.discount_amount) : 0,
    schemeAdjustmentNumber: draft ? fromMoney(draft.scheme_adjustment) : 0,
  };
}
