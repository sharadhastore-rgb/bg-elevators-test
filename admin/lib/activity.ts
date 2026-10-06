import { Admin, CareerApplication, Lead } from "./models";
export async function enrichActivities(activities: any[]) {
  if (!activities.length || activities.every((item) => item.entityName))
    return activities.map((item) => ({ ...item, deleted: false }));
  const byType = (kind: string) =>
    activities
      .filter((x) => x.entityType === kind && !x.entityName)
      .map((x) => x.entityId);
  const leadIds = byType("lead");
  const careerIds = byType("career");
  const teamIds = byType("team");
  const [leads, careers, team] = await Promise.all([
    leadIds.length
      ? Lead.find({ _id: { $in: leadIds } }).select("name").lean()
      : [],
    careerIds.length
      ? CareerApplication.find({ _id: { $in: careerIds } })
          .select("name")
          .lean()
      : [],
    teamIds.length
      ? Admin.find({ _id: { $in: teamIds } }).select("name").lean()
      : [],
  ]);
  const names = new Map(
    [...leads, ...careers, ...team].map((x: any) => [String(x._id), x.name]),
  );
  return activities.map((x) => ({
    ...x,
    entityName: x.entityName || names.get(String(x.entityId)),
    deleted: !x.entityName && !names.has(String(x.entityId)),
  }));
}
