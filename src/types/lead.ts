export interface LeadInput {
  name: string
  phone: string
  email: string
  notes?: string
  propertyId?: number
  propertyTitle?: string
}

export interface LeadResponse {
  success: boolean
  leadId: number
}
