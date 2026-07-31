const INDIA_OFFSET_MILLISECONDS = 5.5 * 60 * 60 * 1000;

export interface AdminFormState {
  message?: string;
}

export const initialAdminFormState: AdminFormState = {};

export function getRequiredText(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

export function getOptionalText(formData: FormData, field: string) {
  const value = getRequiredText(formData, field);
  return value || null;
}

export function getNonNegativeInteger(
  formData: FormData,
  field: string,
  fallback = 0,
) {
  const parsed = Number.parseInt(getRequiredText(formData, field), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

export function isChecked(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

export function isValidHttpUrl(value: string | null) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseIndiaDateTime(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.length === 16 ? `${value}:00` : value;
  const parsed = new Date(`${normalized}+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function toIndiaDateTimeInput(value: string | null) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Date(parsed.getTime() + INDIA_OFFSET_MILLISECONDS)
    .toISOString()
    .slice(0, 16);
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
