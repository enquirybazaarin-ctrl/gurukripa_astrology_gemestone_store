import { Address, IAddress } from './address.model';
import { CustomError } from '../../common/middleware/errorHandler';

export class AddressService {
  async createAddress(userId: string, addressData: any): Promise<IAddress> {
    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    return Address.create({
      ...addressData,
      user: userId
    });
  }

  async getUserAddresses(userId: string): Promise<IAddress[]> {
    return Address.find({ user: userId })
      .sort({ isDefault: -1, createdAt: -1 });
  }

  async updateAddress(addressId: string, userId: string, updateData: any): Promise<IAddress> {
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      throw new CustomError('Address not found', 404);
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      await Address.updateMany({ user: userId, _id: { $ne: addressId } }, { isDefault: false });
    }

    Object.assign(address, updateData);
    await address.save();

    return address;
  }

  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      throw new CustomError('Address not found', 404);
    }

    await address.deleteOne();
  }

  async setDefaultAddress(addressId: string, userId: string): Promise<IAddress> {
    // Unset all defaults
    await Address.updateMany({ user: userId }, { isDefault: false });

    // Set this as default
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      throw new CustomError('Address not found', 404);
    }

    return address;
  }
}

export const addressService = new AddressService();
