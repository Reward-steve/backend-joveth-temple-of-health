const roles = {
  SuperAdmin: [
    "manage_users",
    "manage_rooms",
    "manage_appointments",
    "view_reports",
    "manage_settings",
  ],
  HOD: ["manage_appointments", "view_reports"],
  Receptionist: ["manage_appointments"],
};

module.exports = roles;
