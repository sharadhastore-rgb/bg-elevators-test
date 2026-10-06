export const leadStatuses = [
  "New",
  "Contacted",
  "In Progress",
  "Converted",
  "Closed",
] as const;
export const careerStatuses = [
  "New",
  "Reviewing",
  "Shortlisted",
  "Selected",
  "Rejected",
] as const;
export const leadSources = [
  "Website",
  "Brochure",
  "Phone Call",
  "WhatsApp",
  "Walk-in",
  "Manual",
] as const;
export const teamRoles = ["admin", "staff", "viewer"] as const;
export const activityActions = [
  "created",
  "details_updated",
  "status_changed",
  "favorite_changed",
  "note_updated",
  "deleted",
  "resume_viewed",
  "account_created",
  "access_changed",
  "password_reset",
] as const;
export const actionLabels: Record<string, string> = {
  created: "Created",
  details_updated: "Details edited",
  status_changed: "Status changed",
  favorite_changed: "Favorite changed",
  note_updated: "Note edited",
  deleted: "Deleted",
  resume_viewed: "Resume opened",
  account_created: "Account created",
  access_changed: "Access changed",
  password_reset: "Password reset",
};
