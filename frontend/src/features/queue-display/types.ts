/**
 * Payload published by `call_next` and streamed from
 * `GET /queue/display/{department_id}/stream` as Server-Sent Events.
 *
 * Every field here is PII-free by construction — the backend builds this in
 * `queue/service.py::_advance_queue`, not by filtering on the way out. That is
 * what makes the endpoint safe to serve unauthenticated to a screen bolted to a
 * public corridor wall. Do not add a patient name, UHID or visit id to this
 * type without changing that endpoint's auth first.
 */
export interface TokenCalledPayload {
  department_id: string;
  queue_id: string;
  doctor_name: string | null;
  room_number: string | null;
  token_display: string;
  now_serving: string;
}

/** Envelope written by `publish_event`: {"event_type": ..., "payload": {...}}. */
export interface QueueDisplayEvent {
  event_type: string;
  payload: TokenCalledPayload;
}

export type StreamStatus = "connecting" | "live" | "reconnecting";

/** One counter's current call, keyed by queue so several run side by side. */
export interface NowServing extends TokenCalledPayload {
  /** Client clock — used only to fade older calls, never displayed as fact. */
  received_at: number;
}
