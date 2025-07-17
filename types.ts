export interface Mountain {
  id: number;
  name: string;
  elevation: number;
  prefecture: string;
  region: string;
  difficulty: number;
}

export type ClimbRecord = {
  climbDate: string;
  comment?: string;
  photo?: string; // Base64 encoded image data
};

export type ClimbedRecords = Record<number, ClimbRecord>;