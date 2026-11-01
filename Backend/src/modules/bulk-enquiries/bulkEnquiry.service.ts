import { BulkEnquiry, IBulkEnquiry, LeanBulkEnquiry } from './bulkEnquiry.model';

export class BulkEnquiryService {
  async createBulkEnquiry(enquiryData: any, userId?: string): Promise<IBulkEnquiry> {
    return BulkEnquiry.create({
      ...enquiryData,
      user: userId
    });
  }

  async getMyEnquiries(userId: string): Promise<LeanBulkEnquiry[]> {
    return BulkEnquiry.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAllEnquiries(query: any = {}): Promise<LeanBulkEnquiry[]> {
    return BulkEnquiry.find(query)
      .populate('user', 'name email')
      .populate('contactedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateEnquiryStatus(enquiryId: string, status: string, adminId: string, notes?: string): Promise<IBulkEnquiry> {
    const updateData: any = { status };

    if (status === 'contacted' || status === 'confirmed') {
      updateData.contactedBy = adminId;
      updateData.contactedAt = new Date();
    }

    if (notes) {
      updateData.adminNotes = notes;
    }

    const enquiry = await BulkEnquiry.findByIdAndUpdate(enquiryId, updateData, { new: true });
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    return enquiry;
  }

  async deleteEnquiry(enquiryId: string): Promise<void> {
    const enquiry = await BulkEnquiry.findByIdAndDelete(enquiryId);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
  }
}

export const bulkEnquiryService = new BulkEnquiryService();
