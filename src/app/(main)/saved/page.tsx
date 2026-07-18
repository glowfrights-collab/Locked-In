import { getSessionUser } from "@/lib/session";
import { getSavedProductSummaries } from "@/lib/account";
import { SavedList } from "@/components/account/SavedList";

export default async function SavedPage() {
  const user = await getSessionUser();
  const saved = user ? await getSavedProductSummaries(user.id) : [];

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <h1 className="text-xl font-semibold text-ink">Saved</h1>
      <SavedList products={saved} />
    </div>
  );
}
