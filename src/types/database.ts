export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string;
          organization_id: string;
          status: 'active' | 'inactive' | 'churned';
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          name: string;
          organization_id: string;
          status?: 'active' | 'inactive' | 'churned';
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string;
          organization_id?: string;
          status?: 'active' | 'inactive' | 'churned';
        };
      };
      organizations: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          owner_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          owner_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          owner_id?: string;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
  };
}
