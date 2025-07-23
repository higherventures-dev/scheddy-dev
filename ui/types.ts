export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export type CategoryWithServices = {
  id: string;
  name: string;
  services: Service[];
};