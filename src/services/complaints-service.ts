import type {
  BackendComplaintStatus,
  Complaint,
} from "@/lib/complaints-data";
import type {
  ComplaintListResponse,
  ComplaintQuery,
  UpdateComplaintRequest,
} from "@/lib/api-contracts";
import { apiClient, withQuery } from "@/lib/http-client";

export type ComplaintEvidence = {
  id: string;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  detectionCount: number;
  status: string;
};

type BackendDetection = {
  id?: string;
  model_name?: string;
  result_metadata?: { detections?: unknown[] } | null;
  detection_count: number;
  status: string;
  error_message?: string | null;
};
export type ComplaintService = {
  list: (query?: ComplaintQuery) => Promise<ComplaintListResponse>;
  get: (id: string) => Promise<Complaint>;
  getEvidence: (id: string) => Promise<ComplaintEvidence[]>;
  update: (id: string, request: UpdateComplaintRequest) => Promise<Complaint>;
};

type BackendComplaint = {
  id: string;
  complaint_number: string;
  status: string;
  severity: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string | null;
    area?: string | null;
    zone?: string | null;
  };
  reporter_id: string;
  assigned_team_id?: string | null;
  created_at: string;
};

function mapComplaint(item: BackendComplaint): Complaint {
  const backendStatus = item.status as BackendComplaintStatus;
  const status =
    backendStatus === "RESOLVED"
      ? "Resolved"
      : backendStatus === "IN_PROGRESS"
        ? "In progress"
        : "Open";
  const priority =
    item.severity === "CRITICAL"
      ? "Critical"
      : item.severity === "HIGH"
        ? "High"
        : item.severity === "LOW"
          ? "Low"
          : "Medium";
  return {
    id: item.complaint_number || item.id,
    backendId: item.id,
    title: item.title,
    category: "Pothole",
    backendStatus,
    location: item.location.address || item.location.area || "Unknown",
    zone: item.location.zone || "Unassigned",
    status,
    priority,
    reporter: item.reporter_id,
    reporterEmail: "",
    reportedAt: item.created_at,
    description: item.description,
    image: "",
    assignedTeam: item.assigned_team_id || "Unassigned",
    notes: [],
    coordinates: [item.location.latitude, item.location.longitude],
  };
}

export const realComplaintService: ComplaintService = {
  async list(query = {}) {
    const response = await apiClient.get<{
      items: BackendComplaint[];
      total: number;
      page: number;
      page_size: number;
    }>("/complaints", withQuery({}, { ...query, page_size: query.pageSize }));
    return {
      items: response.data.items.map(mapComplaint),
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.page_size,
    };
  },
  async get(id) {
    const response = await apiClient.get<BackendComplaint>(
      `/complaints/${encodeURIComponent(id)}`,
    );
    return mapComplaint(response.data);
  },
  async getEvidence(id) {
    const images = await apiClient.get<
      Array<{
        id: string;
        capture_metadata?: { latitude?: number; longitude?: number } | null;
      }>
    >(`/complaints/${encodeURIComponent(id)}/images`);
    return Promise.all(
      images.data.map(async (image) => {
        const photo = await apiClient.get<Blob>(
          `/complaints/${encodeURIComponent(id)}/images/${image.id}`,
          { responseType: "blob" },
        );
        const detections = await apiClient.get<BackendDetection[]>(
          `/ai/images/${image.id}/detections`,
        );
        let latest = detections.data[0];
        if (!latest) {
          try {
            latest = (
              await apiClient.post<BackendDetection>(
                `/ai/images/${image.id}/detect`,
              )
            ).data;
          } catch {
            latest = {
              detection_count: 0,
              status: "FAILED",
              error_message: "AI detection could not process this image.",
            };
          }
        }
        const metadata = image.capture_metadata;
        return {
          id: image.id,
          imageUrl: URL.createObjectURL(photo.data),
          latitude: metadata?.latitude ?? null,
          longitude: metadata?.longitude ?? null,
          detectionCount: latest?.detection_count ?? 0,
          status: latest?.status ?? "NOT_RUN",
        };
      }),
    );
  },
  async update(id, request) {
    if (request.status)
      await apiClient.patch(`/complaints/${encodeURIComponent(id)}/status`, {
        status: request.status,
        note: request.note,
      });
    else if (request.note)
      await apiClient.post(`/complaints/${encodeURIComponent(id)}/notes`, {
        note: request.note,
      });
    return realComplaintService.get(id);
  },
};

export const complaintService = realComplaintService;
