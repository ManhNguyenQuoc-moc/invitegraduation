/**
 * DTO (Data Transfer Objects) and Domain Types for Frontend
 */

export type RsvpStatus = "PENDING" | "ATTENDING" | "DECLINED";

export interface IEventDTO {
  title?: string;
  name?: string;
  host_name?: string;
  university?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  theme?: string;
  avatar_url?: string;
  canvas_payload?: any;
}

export interface IRsvpDTO {
  id?: string;
  guest_id?: string;
  status: RsvpStatus;
  plus_ones: number;
  note?: string;
  updated_at?: string;
}

export interface IInvitationDTO {
  id?: string;
  name: string;
  phone?: string | null;
  group_name: string;
  personalized_slug: string;
  event: IEventDTO;
  rsvp?: IRsvpDTO | null;
}

export interface ISubmitRsvpRequestDTO {
  status: RsvpStatus;
  plus_ones: number;
  note?: string;
}

export interface IWishDTO {
  id: number | string;
  author: string;
  relation: string;
  relationColor: string;
  content: string;
  time: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
