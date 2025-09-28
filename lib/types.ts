
export type Request = {
  id: string; // UUID
  requester_name: string | null;
  requester_address: string; // NOT NULL
  location: {
    lat: number;
    lng: number;
  } | null; // GEOGRAPHY(Point, 4326), nullable
  description: string; // NOT NULL
  languages: string[]; // array of text codes ('en', 'sp', ...)
  status: "open" | "in_progress" | "resolved" | "cancelled";
  created_at: string;  // ISO timestamp
  modified_at: string; // ISO timestamp
  requester_online: boolean;
  requester_me: boolean;
}

export type Call = {
  id: string
  request_id: string
  room_uuid: string | null
  taker_name: string | null
  taker_address: string | null
  start_at: string | null
  end_at: string | null
  created_at: string
  modified_at: string
}