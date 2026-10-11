export interface IGuestItem {
  id: string;
  name: string;
  phone: string;
  slug: string;
  group: string;
  status: 'confirmed' | 'pending' | 'declined';
  attendingCount: number;
  wishesCount: number;
}
