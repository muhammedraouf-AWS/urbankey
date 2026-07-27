import { apiClient } from "@/lib/api/client"
import { endpoints } from "@/config/api"
import type { LeadInput, LeadResponse } from "@/types/lead"

export async function createLead(input: LeadInput): Promise<LeadResponse> {
  return apiClient.post<LeadResponse>(endpoints.leads.create, input)
}
