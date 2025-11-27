import { Monument } from './types';

export const MONUMENTS: Monument[] = [
  {
    id: 'basilica-bom-jesus',
    name: 'Basilica of Bom Jesus',
    shortDescription: 'A UNESCO World Heritage Site containing the mortal remains of St. Francis Xavier.',
    fullHistory: 'The Basilica of Bom Jesus is a Roman Catholic basilica located in Old Goa, India. Completed in 1605, it is a prime example of Baroque architecture and one of the oldest churches in Goa. It holds the mortal remains of St. Francis Xavier.',
    // Real coordinates for Old Goa
    position: { lat: 15.5009, lng: 73.9116 },
    // Place ID (kept for reference)
    placeId: 'ChIJb_lI9iGBvzsRv-b4K8wVlQA',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Basilica_of_Bom_Jesus%2C_Old_Goa.jpg/1280px-Basilica_of_Bom_Jesus%2C_Old_Goa.jpg', 
  },
  {
    id: 'rachol-seminary',
    name: 'Rachol Seminary',
    shortDescription: 'The Patriarchal Seminary of Rachol is one of the oldest seminaries in Asia.',
    fullHistory: 'Established in 1609, the Rachol Seminary was originally a fortress. It has served as a center for theological education for centuries and houses rich artifacts and religious art.',
    // Real coordinates for Rachol
    position: { lat: 15.3129, lng: 73.9699 },
    // Place ID (kept for reference)
    placeId: 'ChIJGVtWyBGPvzsRz_0_t2c2z4k', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Rachol_Seminary_Goa.jpg',
  }
];