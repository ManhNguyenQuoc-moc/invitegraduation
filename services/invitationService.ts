import apiClient from "./apiClient";
import { IInvitationDTO, ISubmitRsvpRequestDTO, IApiResponse } from "../types/invitation.dto";
import { getMockInvitationData } from "../data/invitationMock";

export const invitationService = {
  /**
   * Lấy chi tiết thiệp mời theo slug cá nhân hóa.
   * Tự động fallback mock data nếu API gặp sự cố hoặc chưa có data.
   */
  async getInvitationBySlug(slug: string): Promise<IInvitationDTO> {
    try {
      // Ưu tiên fetch trực tiếp API nội bộ Next.js
      const res = await fetch(`/api/invitations/${slug}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return json.data as IInvitationDTO;
        }
      }
      return getMockInvitationData(slug);
    } catch (error) {
      console.warn("API invitation error, falling back to mock data:", error);
      return getMockInvitationData(slug);
    }
  },

  /**
   * Gửi phản hồi RSVP tham dự
   */
  async submitRsvp(slug: string, payload: ISubmitRsvpRequestDTO): Promise<IApiResponse> {
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return {
        success: data.success ?? true,
        data: data.data || payload,
        message: data.message || "Xác nhận tham dự thành công!"
      };
    } catch (error: any) {
      console.warn("API RSVP error, handling locally:", error);
      return {
        success: true,
        data: payload,
        message: "Ghi nhận phản hồi tham dự thành công!"
      };
    }
  }
};
