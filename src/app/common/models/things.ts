export interface Thing {
  id: string; // Unique identifier for the thing
  name: string; // Name of the thing
  description: string; // A brief description of the thing
  container: string; // Reference to a related container or grouping
  room?: string; // Reference to a related room
  tags?: string[]; // Array of tag IDs associated with this thing
}
