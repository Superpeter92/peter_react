export interface Feature {
  id: number | string; // ID of the feature
  name: string; // Name of the feature
  code: string; // Code of the feature
  path: string; // Optional path for the feature
  icon: string; // Optional icon for the feature
  parent_id: number | null; // Parent ID for hierarchical features
  order_index: number; // Order index for sorting features
}

// Represents a feature with its properties and associated permissions
export interface FeatureWithPermissions extends Feature {
  permissions: {
    roleId: number | null; // Role ID associated with the permissions
    permissionName: string; // Name of the permission (e.g., Lettura, Scrittura)
  };
  children: FeatureWithPermissions[]; // Child features for hierarchical structure
}

export interface FeatureOptions extends Feature {
  permissionId: number 
}

