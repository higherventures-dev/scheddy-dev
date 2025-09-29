export function formatServicePrice(service: any) {
  if (service.hide_price_while_booking || service.price_type === 6) return null;

  switch (service.price_type) {
    case 1: // Display as is
      return service.price ? `$${service.price}` : '$125';
    case 2: // Free
      return 'Free';
    case 3: // Starting from price
      return service.price ? `Starting from $${service.price}` : 'Starting from $125';
    case 4: // Price - price2
      if (service.price && service.price2) return `$${service.price} to $${service.price2}`;
      if (service.price) return `$${service.price}`;
      return '$125';
    case 5: // Price/hr
      return service.price ? `$${service.price}/hr` : '$125/hr';
    default:
      return service.price ? `$${service.price}` : '$125';
  }
}
