export const hasPermission = (permissions, moduleCode, action) => {
  if (!permissions || !permissions[moduleCode]) return false;

  const modulePermissions = permissions[moduleCode];
  if(modulePermissions.includes("full_access")) return true;
  if(action === "view"){
    if(modulePermissions.includes("view") || modulePermissions.includes("edit") || modulePermissions.includes("delete") || modulePermissions.includes("edit_own_data") || modulePermissions.includes("delete_own_data")){   
        return true;
    }
  }
  else 
  {
    return modulePermissions.includes(action);
  }
  
}




export const canEdit = (permissions, moduleCode, isOwner = false) => {
  if (hasPermission(permissions, moduleCode, "edit")) return true;

  if (
    isOwner &&
    hasPermission(permissions, moduleCode, "edit_own_data")
  ) {
    return true;
  }

  return false;
};

export const canDelete = (permissions, moduleCode, isOwner = false) => {
  if (hasPermission(permissions, moduleCode, "delete")) return true;

  if (
    isOwner &&
    hasPermission(permissions, moduleCode, "delete_own_data")
  ) {
    return true;
  }

  return false;
};
export const formatPermissions = (permissionsArray) => {
  const byModule = {};

  permissionsArray.forEach((item) => {
    const moduleCode = item.module_code;
    const permissionName = item.permission_type_name;

    if (!byModule[moduleCode]) {
      byModule[moduleCode] = [];
    }

    if (!byModule[moduleCode].includes(permissionName)) {
      byModule[moduleCode].push(permissionName);
    }
  });
console.log("Formatted Permissions by Module:", byModule); // Debug log for formatted permissions
  return {
    byModule,
    raw: permissionsArray
  };
};