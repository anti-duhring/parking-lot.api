export interface ServiceWithAuth {
  user: CompanyUser;

  validateUserPermission(
    id: CompanyId | ParkingLotId | ParkingEventId | VehicleId,
  ): Promise<void> | void;
}
