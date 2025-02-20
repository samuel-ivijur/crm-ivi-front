export const OrganizationStatus = {
  ACTIVE: 1,
  CANCELED: 2,
  SUSPENDED: 3,
};

export const OrganizationStatusColor: { [key: number]: string } = {
  [OrganizationStatus.ACTIVE]: 'green',
  [OrganizationStatus.CANCELED]: 'red',
  [OrganizationStatus.SUSPENDED]: 'orange',
};